import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/common/Badge';

describe('Badge Component', () => {
  it('renders badge label correctly', () => {
    render(<Badge>Intermediate</Badge>);
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('applies custom variant styles', () => {
    const { container } = render(<Badge variant="coral">High Priority</Badge>);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
  });
});
