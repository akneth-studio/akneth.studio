import React from 'react';
import { render } from '@testing-library/react';
import FuzzyText from '../FuzzyText';

describe('FuzzyText component', () => {
  it('renders a canvas element', () => {
    const { container } = render(<FuzzyText>Test fuzzy text</FuzzyText>);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
