import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../components/common/Card';

describe('Card Component', () => {
  it('renders card content with padding', () => {
    render(<Card><h3>Card Title</h3><p>Card body text</p></Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card body text')).toBeInTheDocument();
  });
});
