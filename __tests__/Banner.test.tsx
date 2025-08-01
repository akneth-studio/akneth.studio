import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Banner } from '@/components/layout/Banner';
import '@testing-library/jest-dom';

const maintenanceBanner = {
  id: '1',
  visible: true,
  mode: 'maintenance' as const,
  announce_from: '2025-08-01T08:00:00Z',
  date_start: '2025-08-10T10:00:00Z',
  date_end: '2025-08-10T12:00:00Z',
};

const vacationBanner = {
  id: '2',
  visible: true,
  mode: 'vacation' as const,
  announce_from: '2025-08-01T08:00:00Z',
  date_start: '2025-08-20T00:00:00Z',
  date_end: '2025-08-30T23:59:59Z',
};

describe('Banner component', () => {
  let sessionStorageMock: { [key: string]: string } = {};

  beforeAll(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn((key) => sessionStorageMock[key] || null),
        setItem: jest.fn((key, value) => {
          sessionStorageMock[key] = value.toString();
        }),
        clear: jest.fn(() => {
          sessionStorageMock = {};
        }),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    (window.sessionStorage.clear as jest.Mock)();
    jest.setSystemTime(new Date('2025-08-05T12:00:00Z'));
  });

  it('renders a visible maintenance banner within the correct date range', () => {
    render(<Banner banners={[maintenanceBanner]} />);
    expect(screen.getByText(/prace serwisowe/)).toBeInTheDocument();
  });

  it('renders a visible vacation banner within the correct date range', () => {
    render(<Banner banners={[vacationBanner]} />);
    expect(screen.getByText(/jestem na urlopie/)).toBeInTheDocument();
  });

  it('does not render a banner if it is not visible', () => {
    render(<Banner banners={[{ ...maintenanceBanner, visible: false }]} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not render a banner if current date is before announce_from', () => {
    jest.setSystemTime(new Date('2025-07-30T12:00:00Z'));
    render(<Banner banners={[maintenanceBanner]} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not render a banner if current date is after date_end', () => {
    jest.setSystemTime(new Date('2025-08-11T12:00:00Z'));
    render(<Banner banners={[{...maintenanceBanner, date_end: '2025-08-10T12:00:00Z'}]} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('closes a banner when the close button is clicked', async () => {
    render(<Banner banners={[maintenanceBanner]} />);
    const banner = screen.getByRole('status');
    expect(banner).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Zamknij baner');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('closedBanners', JSON.stringify([maintenanceBanner.id]));
  });

  it('does not render a banner that has been previously closed', () => {
    sessionStorageMock['closedBanners'] = JSON.stringify([maintenanceBanner.id]);
    render(<Banner banners={[maintenanceBanner]} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders multiple active banners', () => {
    render(<Banner banners={[maintenanceBanner, vacationBanner]} />);
    expect(screen.getByText(/prace serwisowe/)).toBeInTheDocument();
    expect(screen.getByText(/jestem na urlopie/)).toBeInTheDocument();
  });

  it('renders nothing if no banners are provided', () => {
    const { container } = render(<Banner banners={[]} />);
    expect(container.firstChild).toBeNull();
  });
});