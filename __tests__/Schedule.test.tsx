import React from 'react';
import { render } from '@testing-library/react';
import Schedule from '../src/components/contact/Schedule';

describe('Schedule component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Schedule />);
    expect(container).not.toBeEmptyDOMElement();
  });
});
