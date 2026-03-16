import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'test-input',
    placeholder: 'Enter text',
    value: '',
    onChange: jest.fn(),
  };

  it('should render Input with default props', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<Input {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'New value' } });
    
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should display error message when error is true', () => {
    render(<Input {...defaultProps} error errorMessage="This field is required" />);
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input {...defaultProps} disabled />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeDisabled();
  });
});
