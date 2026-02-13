/**
 * Tests for SearchBar component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(
      <SearchBar 
        value="" 
        onChange={vi.fn()} 
        placeholder="Search agents..."
      />
    );
    
    expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    render(
      <SearchBar 
        value="" 
        onChange={vi.fn()} 
        ariaLabel="Search agents by name"
      />
    );
    
    expect(screen.getByLabelText('Search agents by name')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="test query" onChange={vi.fn()} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test query');
  });

  it('calls onChange when typing', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new query' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('new query');
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    
    const clearButton = screen.queryByRole('button', { name: /Clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('shows clear button when value is not empty', () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    
    const clearButton = screen.getByRole('button', { name: /Clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('clears the search when clear button is clicked', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="test query" onChange={handleChange} />);
    
    const clearButton = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('renders search icon', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    
    // The search icon is an emoji, so we check for its presence in the wrapper
    const wrapper = screen.getByRole('textbox').closest('.search-bar-wrapper');
    expect(wrapper).toHaveTextContent('🔍');
  });
});
