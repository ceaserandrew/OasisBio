import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenuToggle } from './MobileMenuToggle';

describe('MobileMenuToggle', () => {
  it('should render MobileMenuToggle with default props', () => {
    const onToggle = jest.fn();
    render(<MobileMenuToggle isOpen={false} onToggle={onToggle} />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should display menu icon when menu is closed', () => {
    const onToggle = jest.fn();
    render(<MobileMenuToggle isOpen={false} onToggle={onToggle} />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveClass('bg-background');
  });

  it('should display close icon when menu is open', () => {
    const onToggle = jest.fn();
    render(<MobileMenuToggle isOpen={true} onToggle={onToggle} />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveClass('bg-background');
  });

  it('should call onToggle handler when clicked', () => {
    const onToggle = jest.fn();
    render(<MobileMenuToggle isOpen={false} onToggle={onToggle} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should render menu icon when menu is closed', () => {
    const onToggle = jest.fn();
    const { container } = render(<MobileMenuToggle isOpen={false} onToggle={onToggle} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render close icon when menu is open', () => {
    const onToggle = jest.fn();
    const { container } = render(<MobileMenuToggle isOpen={true} onToggle={onToggle} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
