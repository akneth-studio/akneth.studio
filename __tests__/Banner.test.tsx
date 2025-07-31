import React from 'react';
import { render, screen } from '@testing-library/react';
import { Banner } from '../src/components/layout/Banner';

describe('Banner component', () => {
  it('renders without crashing', () => {
    const banners = [
      {
        id: '1',
        visible: true,
        mode: 'maintenance' as any,
        announce_from: '2020-01-01',
        date_start: '2020-01-01',
        date_end: '2099-12-31',
        message: 'Test banner message',
      },
    ];
    render(<Banner banners={banners} />);
    const bannerElement = screen.getByRole('status');
    expect(bannerElement).toBeInTheDocument();
  });
});
