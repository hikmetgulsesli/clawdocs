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
    description: 'Writes code',
    skills: [{ id: 's1', name: 'Code', description: 'Code skill', location: '/code' }],
    tools: [{ id: 't1', name: 'read', description: 'Read file' }],
    lastUpdated: new Date(),
  },
  {
    id: 'agent-2',
    name: 'Reviewer',
    role: 'Code Reviewer',
    model: 'anthropic/claude-sonnet-4-5',
    description: 'Reviews code',
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
    expect(screen.getByText(/2 total/)).toBeInTheDocument();
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
    expect(listItems).toHaveLength(2);
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
