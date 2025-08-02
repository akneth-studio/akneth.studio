/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import VacationAdminPage from '@/app/(admin)/admin/vacation/page';

// Mock the Auth component
jest.mock('@/components/admin/auth', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

global.fetch = jest.fn();

const mockBanners = [
    {
        id: '1',
        mode: 'vacation',
        announce_from: '2025-08-01T10:00:00.000Z',
        date_start: '2025-08-10T00:00:00.000Z',
        date_end: '2025-08-20T00:00:00.000Z',
        visible: true,
    },
    {
        id: '2',
        mode: 'maintenance',
        announce_from: '2025-09-01T12:00:00.000Z',
        date_start: '2025-09-05T00:00:00.000Z',
        date_end: '2025-09-06T00:00:00.000Z',
        visible: false,
    },
];

describe('VacationAdminPage', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    it('matches snapshot', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockBanners,
        });
        const { asFragment } = render(<VacationAdminPage />);
        await waitFor(() => {
            expect(screen.getByText('Urlop')).toBeInTheDocument();
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders loading state initially', () => {
        (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
        render(<VacationAdminPage />);
        expect(screen.getByText('Wczytywanie…')).toBeInTheDocument();
    });

    it('renders banners after successful fetch', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockBanners,
        });
        render(<VacationAdminPage />);
        await waitFor(() => {
            expect(screen.getByText('Urlop')).toBeInTheDocument();
            expect(screen.getByText('Prace serwisowe')).toBeInTheDocument();
        });
    });

    it('renders no banners message when fetch returns empty array', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });
        render(<VacationAdminPage />);
        await waitFor(() => {
            expect(screen.getByText('Brak komunikatów w bazie.')).toBeInTheDocument();
        });
    });

    it('displays an error message if fetching banners fails', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
        render(<VacationAdminPage />);
        await waitFor(() => {
            expect(screen.getByText(/Błąd pobierania komunikatów/i)).toBeInTheDocument();
        });
    });

    it('opens and closes the add modal', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });
        render(<VacationAdminPage />);
        await waitFor(() => {
            fireEvent.click(screen.getByTestId('add-banner-button'));
        });
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Dodaj komunikat');
        fireEvent.click(screen.getByText('Anuluj'));
        await waitFor(() => {
            expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
        });
    });

    it('adds a new banner and shows success message', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] });
        render(<VacationAdminPage />);
        await waitFor(() => fireEvent.click(screen.getByTestId('add-banner-button')));

        fireEvent.change(screen.getByLabelText(/Początek/i), { target: { value: '2025-08-10T00:00' } });
        fireEvent.change(screen.getByLabelText(/Koniec/i), { target: { value: '2025-08-20T00:00' } });
        fireEvent.change(screen.getByLabelText(/Ogłoszenie od/i), { target: { value: '2025-08-01T10:00' } });

        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockBanners });

        fireEvent.click(screen.getByTestId('modal-submit-button'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/banners', expect.objectContaining({ method: 'POST' }));
            expect(screen.getByText('Dodano komunikat.')).toBeInTheDocument();
        });
    });

    it('shows an error message when adding a banner fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] });
        render(<VacationAdminPage />);
        await waitFor(() => fireEvent.click(screen.getByTestId('add-banner-button')));

        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, json: async () => ({ error: { message: 'Failed to add' } }) });

        fireEvent.click(screen.getByTestId('modal-submit-button'));

        await waitFor(() => {
            expect(screen.getByText('Failed to add')).toBeInTheDocument();
        });
    });

    it('edits a banner and shows success message', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockBanners });
        render(<VacationAdminPage />);
        await waitFor(() => fireEvent.click(screen.getByTestId('edit-banner-1')));

        fireEvent.change(screen.getByLabelText(/Początek/i), { target: { value: '2025-08-11T00:00' } });

        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockBanners });

        fireEvent.click(screen.getByTestId('modal-submit-button'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/banners', expect.objectContaining({ method: 'PATCH' }));
            expect(screen.getByText('Zaktualizowano komunikat.')).toBeInTheDocument();
        });
    });

    it('shows an error message when editing a banner fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockBanners });
        render(<VacationAdminPage />);
        await waitFor(() => fireEvent.click(screen.getByTestId('edit-banner-1')));

        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, json: async () => ({ error: { message: 'Failed to update' } }) });

        fireEvent.click(screen.getByTestId('modal-submit-button'));

        await waitFor(() => {
            expect(screen.getByText('Failed to update')).toBeInTheDocument();
        });
    });

    it('deletes a banner and shows success message', async () => {
        window.confirm = jest.fn(() => true);
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockBanners }) // Initial fetch for rendering
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // Mock for the DELETE request
            .mockResolvedValueOnce({ ok: true, json: async () => [] }); // Mock for the re-fetch after delete
        render(<VacationAdminPage />);
        await screen.findByText('Urlop'); // Wait for banners to render
        const deleteButton = await screen.findByTestId('delete-banner-1');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/banners', expect.objectContaining({ method: 'DELETE' }));
        });
        expect(await screen.findByText(/Usunięto komunikat/i)).toBeInTheDocument();
    });

    it('shows an error message when deleting a banner fails', async () => {
        window.confirm = jest.fn(() => true);
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockBanners }) // Initial fetch for rendering
            .mockResolvedValueOnce({ ok: false, json: async () => ({ error: { message: 'Failed to delete' } }) }); // Mock for the DELETE request
        render(<VacationAdminPage />);
        await screen.findByText('Urlop'); // Wait for banners to render
        const deleteButton = await screen.findByTestId('delete-banner-1');
        fireEvent.click(deleteButton);

        expect(await screen.findByText('Failed to delete')).toBeInTheDocument();
    });

    it('does not delete if user cancels confirmation', async () => {
        window.confirm = jest.fn(() => false);
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockBanners }); // Initial fetch for rendering
        render(<VacationAdminPage />);
        await screen.findByText('Urlop'); // Wait for banners to render
        const deleteButton = await screen.findByTestId('delete-banner-1');
        fireEvent.click(deleteButton);

        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('shows validation errors for empty fields', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] });
        render(<VacationAdminPage />);
        await waitFor(() => fireEvent.click(screen.getByTestId('add-banner-button')));

        fireEvent.change(screen.getByLabelText(/Początek/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/Koniec/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/Ogłoszenie od/i), { target: { value: '' } });

        const formElement = screen.getByTestId('modal-submit-button').closest('form');
        if (formElement) {
            fireEvent.submit(formElement);
        }

        await waitFor(async () => {
            expect(await screen.findAllByText(/Wymagane\./i)).toHaveLength(3);
        });
    });

    it('shows validation error for end date before start date', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] });
        render(<VacationAdminPage />);
        await waitFor(() => fireEvent.click(screen.getByTestId('add-banner-button')));

        fireEvent.change(screen.getByLabelText(/Początek/i), { target: { value: '2025-08-20T00:00' } });
        fireEvent.change(screen.getByLabelText(/Koniec/i), { target: { value: '2025-08-10T00:00' } });

        const formElement = screen.getByTestId('modal-submit-button').closest('form');
        if (formElement) {
            fireEvent.submit(formElement);
        }

        await waitFor(async () => {
            expect(await screen.findByText('Data zakończenia nie może być wcześniejsza niż początek.')).toBeInTheDocument();
        });
    });
});