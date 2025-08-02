/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ContentManagementPage from '@/app/(admin)/admin/content/page';

// Mock the Auth component
jest.mock('@/components/admin/auth', () => {
  return {
    __esModule: true,
    default: jest.fn(({ children }) => {
      return React.createElement('div', { 'data-testid': 'auth-wrapper' }, children);
    })
  };
});

// Mock the CTAButton component
jest.mock('@/components/CTAButton', () => {
  return {
    __esModule: true,
    default: jest.fn(({ text, onClick }) => {
      return React.createElement('button', { 
        'data-testid': 'cta-button', 
        'data-text': text, 
        onClick: onClick 
      }, text);
    })
  };
});

// Mock Bootstrap dynamic import
jest.mock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({}));

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('Content Management Page', () => {
  const originalError = console.error;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console errors during tests
    console.error = jest.fn();
  });
  
  afterEach(() => {
    // Restore console.error after each test
    console.error = originalError;
  });

  it('renders loading state initially', async () => {
    // Mock fetch to return a promise that resolves after a delay
    mockFetch.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve([])
      }), 100);
    }));

    render(<ContentManagementPage />);
    
    // Check if loading state is displayed
    expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
    
    // Wait for loading to complete and check empty state
    await waitFor(() => {
      expect(screen.getByText('Brak plików w buckecie.')).toBeInTheDocument();
    });
  });

  it('renders files when fetch succeeds', async () => {
    const mockFiles = [
      { name: 'file1.txt', id: '1', path: 'folder1/file1.txt' },
      { name: 'file2.txt', id: '2', path: 'folder1/file2.txt' },
      { name: 'file3.txt', id: '3', path: 'folder2/file3.txt' }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFiles)
    });

    render(<ContentManagementPage />);
    
    // Wait for files to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('folder1')).toBeInTheDocument();
      expect(screen.getByText('folder2')).toBeInTheDocument();
    });

    // Check if files are rendered
    expect(screen.getByText('file1.txt')).toBeInTheDocument();
    expect(screen.getByText('file2.txt')).toBeInTheDocument();
    expect(screen.getByText('file3.txt')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<ContentManagementPage />);
    
    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Nie udało się pobrać listy plików. Sprawdź konsolę deweloperską (F12).')).toBeInTheDocument();
    });
  });

  it('shows file details when file is selected', async () => {
    const mockFiles = [
      { name: 'test-file.txt', id: '1', path: 'documents/test-file.txt' }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFiles)
    });

    render(<ContentManagementPage />);
    
    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('documents')).toBeInTheDocument();
    });

    // Click on the folder to expand it
    const folderButton = screen.getByText('documents');
    fireEvent.click(folderButton);

    // Click on the file to select it
    const fileButton = screen.getByText('test-file.txt');
    fireEvent.click(fileButton);

    // Check if file details are shown
    expect(screen.getByText('Wybrany plik:')).toBeInTheDocument();
    expect(screen.getByText('documents/test-file.txt', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Pobierz')).toBeInTheDocument();
    expect(screen.getByText('Aktualizuj plik')).toBeInTheDocument();
  });

  it('handles file selection for upload', async () => {
    const mockFiles = [
      { name: 'test-file.txt', id: '1', path: 'documents/test-file.txt' }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFiles)
    });

    render(<ContentManagementPage />);
    
    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('documents')).toBeInTheDocument();
    });

    // Click on the folder to expand it
    const folderButton = screen.getByText('documents');
    fireEvent.click(folderButton);

    // Click on the file to select it
    const fileButton = screen.getByText('test-file.txt');
    fireEvent.click(fileButton);

    // Find the file input and simulate file selection
    const fileInput = screen.getByTestId('auth-wrapper').querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a mock file
    const mockFile = new File(['content'], 'new-file.txt', { type: 'text/plain' });
    
    // Simulate file selection
    fireEvent.change(fileInput, {
      target: { files: [mockFile] }
    });

    // Check if confirm button appears with correct text
    await waitFor(() => {
      const confirmButtons = screen.getAllByTestId('cta-button');
      const confirmButton = confirmButtons.find(button => 
        button.getAttribute('data-text')?.includes('Potwierdź aktualizację')
      );
      expect(confirmButton).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles file download', async () => {
    const mockFiles = [
      { name: 'test-file.txt', id: '1', path: 'documents/test-file.txt' }
    ];

    // Mock successful file download
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFiles)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ signedUrl: 'https://example.com/file.txt' })
      });

    render(<ContentManagementPage />);
    
    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('documents')).toBeInTheDocument();
    });

    // Click on the folder to expand it
    const folderButton = screen.getByText('documents');
    fireEvent.click(folderButton);

    // Click on the file to select it
    const fileButton = screen.getByText('test-file.txt');
    fireEvent.click(fileButton);

    // Click the download button
    const downloadButtons = screen.getAllByTestId('cta-button');
    const downloadButton = downloadButtons.find(button => 
      button.getAttribute('data-text') === 'Pobierz'
    );
    expect(downloadButton).toBeInTheDocument();
    if (downloadButton) {
      fireEvent.click(downloadButton);
    }

    // Wait for fetch calls
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    // Check that the download API was called correctly
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/cms/files/documents/test-file.txt');
  });

  it('handles download error', async () => {
    const mockFiles = [
      { name: 'test-file.txt', id: '1', path: 'documents/test-file.txt' }
    ];

    // Mock successful file list fetch but failed download
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFiles)
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500
      });

    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ContentManagementPage />);
    
    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('documents')).toBeInTheDocument();
    });

    // Click on the folder to expand it
    const folderButton = screen.getByText('documents');
    fireEvent.click(folderButton);

    // Click on the file to select it
    const fileButton = screen.getByText('test-file.txt');
    fireEvent.click(fileButton);

    // Click the download button
    const downloadButtons = screen.getAllByTestId('cta-button');
    const downloadButton = downloadButtons.find(button => 
      button.getAttribute('data-text') === 'Pobierz'
    );
    expect(downloadButton).toBeInTheDocument();
    if (downloadButton) {
      fireEvent.click(downloadButton);
    }

    // Wait for error handling
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Nie udało się pobrać pliku.');
    });

    mockAlert.mockRestore();
  });

  it('handles file upload confirmation', async () => {
    const mockFiles = [
      { name: 'test-file.txt', id: '1', path: 'documents/test-file.txt' }
    ];

    // Mock successful file list fetch and upload
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFiles)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'File updated' })
      });

    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ContentManagementPage />);
    
    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('documents')).toBeInTheDocument();
    });

    // Click on the folder to expand it
    const folderButton = screen.getByText('documents');
    fireEvent.click(folderButton);

    // Click on the file to select it
    const fileButton = screen.getByText('test-file.txt');
    fireEvent.click(fileButton);

    // Find the file input and simulate file selection
    const fileInput = screen.getByTestId('auth-wrapper').querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a mock file
    const mockFile = new File(['content'], 'new-file.txt', { type: 'text/plain' });
    
    // Simulate file selection
    fireEvent.change(fileInput, {
      target: { files: [mockFile] }
    });

    // Wait for confirm button to appear and click it
    await waitFor(() => {
      const confirmButtons = screen.getAllByTestId('cta-button');
      const confirmButton = confirmButtons.find(button => 
        button.getAttribute('data-text')?.includes('Potwierdź aktualizację')
      );
      expect(confirmButton).toBeInTheDocument();
      if (confirmButton) {
        fireEvent.click(confirmButton);
      }
    });

    // Wait for upload to complete
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Plik zaktualizowany pomyślnie!');
    });

    // Check that fetch was called for upload
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/cms/files/documents/test-file.txt', expect.objectContaining({
      method: 'POST'
    }));

    mockAlert.mockRestore();
  });

  it('handles upload error', async () => {
    const mockFiles = [
      { name: 'test-file.txt', id: '1', path: 'documents/test-file.txt' }
    ];

    // Mock successful file list fetch but failed upload
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFiles)
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' })
      });

    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ContentManagementPage />);
    
    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('documents')).toBeInTheDocument();
    });

    // Click on the folder to expand it
    const folderButton = screen.getByText('documents');
    fireEvent.click(folderButton);

    // Click on the file to select it
    const fileButton = screen.getByText('test-file.txt');
    fireEvent.click(fileButton);

    // Find the file input and simulate file selection
    const fileInput = screen.getByTestId('auth-wrapper').querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a mock file
    const mockFile = new File(['content'], 'new-file.txt', { type: 'text/plain' });
    
    // Simulate file selection
    fireEvent.change(fileInput, {
      target: { files: [mockFile] }
    });

    // Wait for confirm button to appear and click it
    await waitFor(() => {
      const confirmButtons = screen.getAllByTestId('cta-button');
      const confirmButton = confirmButtons.find(button => 
        button.getAttribute('data-text')?.includes('Potwierdź aktualizację')
      );
      expect(confirmButton).toBeInTheDocument();
      if (confirmButton) {
        fireEvent.click(confirmButton);
      }
    });

    // Wait for error alert
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalled();
    });

    mockAlert.mockRestore();
  });

  it('matches snapshot', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    const { container } = render(<ContentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Brak plików w buckecie.')).toBeInTheDocument();
    });
    
    expect(container).toMatchSnapshot();
  });
});
