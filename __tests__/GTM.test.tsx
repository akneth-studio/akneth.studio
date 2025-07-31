import React from 'react';
import { render } from '@testing-library/react';
import GTM from '../src/components/GTM';

describe('GTM component', () => {
  it('renders without crashing', () => {
    const { container } = render(<GTM />);
    expect(container).toBeTruthy();
  });
});
