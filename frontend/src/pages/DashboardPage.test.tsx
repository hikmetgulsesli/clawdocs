/**
 * Tests for DashboardPage component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';
import type { Agent, Skill } from '@clawdocs/shared';

// Mock the hooks
const mockUseAgents = vi.fn();
const mockUseSkills = vi.fn();

vi.mock('../hooks/useAgents', () => ({
  useAgents: () => mockUseAgents(),
}));

vi.mock('../hooks/useSkills', () => ({
  useSkills: () => mockUseSkills(),
}));

const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Developer',
    role: 'Code Writer',
    model: 'kimi-coding/k2p5',
    description: 'Writes code',
    skills: [{ id: 's1', name: 'Code', description: 'Code skill', location: '/code' }],
    tools: [
      { id: 't1', name: 'read', description: 'Read file' },
      { id: 't2', name: 'write', description: 'Write file' },
    ],
    lastUpdated: new Date(),
  },
  {
    id: 'agent-2',
    name: 'Reviewer',
    role: 'Code Reviewer',
    model: 'anthropic/claude-sonnet-4-5',
    description: 'Reviews code',
    skills: [],
    tools: [{ id: 't3', name: 'edit', description: 'Edit file' }],
    lastUpdated: new Date(),
  },
];

const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'coding',
    description: 'Coding skill',
    location: '/usr/lib/skills/coding',
  },
  {
    id: 'skill-2',
    name: 'testing',
    description: 'Testing skill',
    location: '/home/user/.openclaw/skills/testing',
  },
  {
    id: 'skill-3',
    name: 'deploy',
    description: 'Deployment skill',
    location: '/usr/lib/skills/deploy',
  },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    mockUseAgents.mockReset();
    mockUseSkills.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome message and overview', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText('Welcome to ClawDocs')).toBeInTheDocument();
    expect(screen.getByText(/central hub for OpenClaw agent documentation/)).toBeInTheDocument();
  });

  it('displays total agents count in stat card', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    const statValues = screen.getAllByTestId('stat-value');
    expect(statValues[0]).toHaveTextContent('2');
    expect(screen.getByText('Total Agents')).toBeInTheDocument();
  });

  it('displays total skills count in stat card', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    const statValues = screen.getAllByTestId('stat-value');
    expect(statValues[1]).toHaveTextContent('3');
    expect(screen.getByText('Total Skills')).toBeInTheDocument();
  });

  it('displays total tools count in stat card', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    const statValues = screen.getAllByTestId('stat-value');
    // Agent 1 has 2 tools, Agent 2 has 1 tool = 3 total
    expect(statValues[2]).toHaveTextContent('3');
    expect(screen.getByText('Total Tools')).toBeInTheDocument();
  });

  it('shows last scan timestamp', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText('Last scan:')).toBeInTheDocument();
    expect(screen.getByTestId('last-scan-timestamp')).toBeInTheDocument();
  });

  it('quick navigation link to agents works correctly', () => {
    const onNavigate = vi.fn();
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage onNavigate={onNavigate} />);

    const agentsButton = screen.getByRole('button', { name: /View all agents/i });
    expect(agentsButton).toBeInTheDocument();
    expect(screen.getByText('View Agents')).toBeInTheDocument();
    expect(screen.getByText('2 agents')).toBeInTheDocument();

    fireEvent.click(agentsButton);
    expect(onNavigate).toHaveBeenCalledWith('agents');
  });

  it('quick navigation link to skills works correctly', () => {
    const onNavigate = vi.fn();
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage onNavigate={onNavigate} />);

    const skillsButton = screen.getByRole('button', { name: /View all skills/i });
    expect(skillsButton).toBeInTheDocument();
    expect(screen.getByText('View Skills')).toBeInTheDocument();
    expect(screen.getByText('3 skills')).toBeInTheDocument();

    fireEvent.click(skillsButton);
    expect(onNavigate).toHaveBeenCalledWith('skills');
  });

  it('renders loading state', () => {
    mockUseAgents.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseAgents.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Network error'),
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Failed to load dashboard data/)).toBeInTheDocument();
  });

  it('displays zero counts when no data', () => {
    mockUseAgents.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    const statValues = screen.getAllByTestId('stat-value');
    expect(statValues[0]).toHaveTextContent('0');
    expect(statValues[1]).toHaveTextContent('0');
    expect(statValues[2]).toHaveTextContent('0');
  });

  it('has correct aria labels for accessibility', () => {
    mockUseAgents.mockReturnValue({
      data: mockAgents,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByRole('region', { name: /Dashboard statistics/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Quick navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Total Agents statistic/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Total Skills statistic/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Total Tools statistic/i })).toBeInTheDocument();
  });
});
