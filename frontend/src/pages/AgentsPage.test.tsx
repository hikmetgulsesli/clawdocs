/**
 * Tests for AgentsPage component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentsPage } from './AgentsPage';
import type { Agent } from '@clawdocs/shared';

// Mock the useAgents hook
const mockUseAgents = vi.fn();

vi.mock('../hooks/useAgents', () => ({
  useAgents: () => mockUseAgents(),
}));

const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Developer',
    role: 'Code Writer',
    model: 'kimi-coding/k2p5',
    description: 'Writes code for applications',
    skills: [{ id: 's1', name: 'Code', description: 'Code skill', location: '/code' }],
    tools: [{ id: 't1', name: 'read', description: 'Read file' }],
    lastUpdated: new Date(),
  },
  {
    id: 'agent-2',
    name: 'Reviewer',
    role: 'Code Reviewer',
    model: 'anthropic/claude-sonnet-4-5',
    description: 'Reviews code quality',
    skills: [],
    tools: [],
    lastUpdated: new Date(),
  },
  {
    id: 'agent-3',
    name: 'Tester',
    role: 'QA Engineer',
    model: 'gpt-4',
    description: 'Tests application functionality',
    skills: [],
    tools: [],
    lastUpdated: new Date(),
  },
];

describe('AgentsPage', () => {
  beforeEach(() => {
    mockUseAgents.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseAgents.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    expect(screen.getByText('Loading agents...')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const refetch = vi.fn();
    mockUseAgents.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Network error'),
      refetch,
    });

    render(<AgentsPage />);
    
    expect(screen.getByText(/Failed to load agents: Network error/)).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders empty state with refresh button', () => {
    const refetch = vi.fn();
    mockUseAgents.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch,
    });

    render(<AgentsPage />);
    
    expect(screen.getByText('No agents found.')).toBeInTheDocument();
    
    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    expect(refreshButton).toBeInTheDocument();
    
    fireEvent.click(refreshButton);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders agents grid with agent cards', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Reviewer')).toBeInTheDocument();
    expect(screen.getByText('Tester')).toBeInTheDocument();
  });

  it('renders search bar with correct placeholder', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    expect(screen.getByPlaceholderText('Search agents by name, role, or description...')).toBeInTheDocument();
  });

  it('filters agents by name (case-insensitive)', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'dev' } });
    
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.queryByText('Reviewer')).not.toBeInTheDocument();
    expect(screen.queryByText('Tester')).not.toBeInTheDocument();
  });

  it('filters agents by role (case-insensitive)', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'CODE' } });
    
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Reviewer')).toBeInTheDocument();
    expect(screen.queryByText('Tester')).not.toBeInTheDocument();
  });

  it('filters agents by description (case-insensitive)', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'quality' } });
    
    expect(screen.queryByText('Developer')).not.toBeInTheDocument();
    expect(screen.getByText('Reviewer')).toBeInTheDocument();
    expect(screen.queryByText('Tester')).not.toBeInTheDocument();
  });

  it('shows no results message when filter returns empty', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No agents match your search.')).toBeInTheDocument();
  });

  it('shows clear search button when there are no results', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Use closest to find the button in the no-results section
    const noResultsSection = screen.getByText('No agents match your search.').closest('.agents-no-results');
    const clearButton = noResultsSection?.querySelector('button');
    expect(clearButton).toBeInTheDocument();
    
    fireEvent.click(clearButton!);
    
    // After clearing, all agents should be visible again
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Reviewer')).toBeInTheDocument();
    expect(screen.getByText('Tester')).toBeInTheDocument();
  });

  it('shows clear button in search bar when typing', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    const clearButton = screen.getByRole('button', { name: /Clear search/i });
    expect(clearButton).toBeInTheDocument();
    
    fireEvent.click(clearButton);
    
    // After clearing, all agents should be visible
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Reviewer')).toBeInTheDocument();
    expect(screen.getByText('Tester')).toBeInTheDocument();
  });

  it('displays showing count in search section', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    expect(screen.getByText('Showing 3 of 3')).toBeInTheDocument();
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'dev' } });
    
    expect(screen.getByText('Showing 1 of 3')).toBeInTheDocument();
  });

  it('renders agent list with correct aria attributes', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    const list = screen.getByRole('list', { name: /Agent list/i });
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('calls onAgentClick when agent card is clicked', () => {
    const handleAgentClick = vi.fn();
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage onAgentClick={handleAgentClick} />);
    
    const developerCard = screen.getByRole('button', { name: /View details for Developer/ });
    fireEvent.click(developerCard);
    
    expect(handleAgentClick).toHaveBeenCalledTimes(1);
    expect(handleAgentClick).toHaveBeenCalledWith(mockAgents[0]);
  });

  it('displays page header with correct text', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<AgentsPage />);
    
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText(/Browse all available OpenClaw agents/)).toBeInTheDocument();
  });
});
