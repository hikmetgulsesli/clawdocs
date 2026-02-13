/**
 * Tests for SkillsPage component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsPage } from './SkillsPage';
import type { Skill } from '@clawdocs/shared';

// Mock the useSkills hook
const mockUseSkills = vi.fn();

vi.mock('../hooks/useSkills', () => ({
  useSkills: () => mockUseSkills(),
}));

const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'github',
    description: 'Interact with GitHub using the gh CLI.',
    location: '/usr/lib/node_modules/openclaw/skills/github',
  },
  {
    id: 'skill-2',
    name: 'weather',
    description: 'Get current weather and forecasts.',
    location: '/usr/lib/node_modules/openclaw/skills/weather',
  },
  {
    id: 'skill-3',
    name: 'my-custom-skill',
    description: 'A custom user skill.',
    location: 'user:/home/setrox/.openclaw/skills/my-custom-skill',
  },
];

describe('SkillsPage', () => {
  beforeEach(() => {
    mockUseSkills.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseSkills.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    expect(screen.getByText('Loading skills...')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const refetch = vi.fn();
    mockUseSkills.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Network error'),
      refetch,
    });

    render(<SkillsPage />);
    
    expect(screen.getByText(/Failed to load skills: Network error/)).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders empty state with refresh button', () => {
    const refetch = vi.fn();
    mockUseSkills.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch,
    });

    render(<SkillsPage />);
    
    expect(screen.getByText('No skills found.')).toBeInTheDocument();
    
    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    expect(refreshButton).toBeInTheDocument();
    
    fireEvent.click(refreshButton);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders skills grid with skill cards', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('weather')).toBeInTheDocument();
    expect(screen.getByText('my-custom-skill')).toBeInTheDocument();
    expect(screen.getByText(/3 total/)).toBeInTheDocument();
  });

  it('displays system and user skill counts', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    // 2 system skills, 1 user skill
    expect(screen.getByText(/2 system/)).toBeInTheDocument();
    expect(screen.getByText(/1 user/)).toBeInTheDocument();
  });

  it('renders skill list with correct aria attributes', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    const list = screen.getByRole('list', { name: /Skill list/i });
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('calls onSkillClick when skill card is clicked', () => {
    const handleSkillClick = vi.fn();
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage onSkillClick={handleSkillClick} />);
    
    const githubCard = screen.getByRole('button', { name: /View details for github/ });
    fireEvent.click(githubCard);
    
    expect(handleSkillClick).toHaveBeenCalledTimes(1);
    expect(handleSkillClick).toHaveBeenCalledWith(mockSkills[0]);
  });

  it('displays page header with correct text', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText(/Browse all available OpenClaw skills/)).toBeInTheDocument();
  });

  it('filters skills by search query (name)', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search skills by name or description/i);
    fireEvent.change(searchInput, { target: { value: 'github' } });
    
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.queryByText('weather')).not.toBeInTheDocument();
    expect(screen.queryByText('my-custom-skill')).not.toBeInTheDocument();
    expect(screen.getByText(/Showing 1 of 3/)).toBeInTheDocument();
  });

  it('filters skills by search query (description)', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search skills by name or description/i);
    fireEvent.change(searchInput, { target: { value: 'weather' } });
    
    expect(screen.queryByText('github')).not.toBeInTheDocument();
    expect(screen.getByText('weather')).toBeInTheDocument();
    expect(screen.queryByText('my-custom-skill')).not.toBeInTheDocument();
  });

  it('shows no results message when search has no matches', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search skills by name or description/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No skills match your search.')).toBeInTheDocument();
    // Look for the clear button in the no-results section
    const noResultsSection = screen.getByText('No skills match your search.').closest('.skills-no-results');
    expect(noResultsSection?.querySelector('button')).toHaveTextContent(/Clear Search/i);
  });

  it('clears search when clear button is clicked', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search skills by name or description/i);
    fireEvent.change(searchInput, { target: { value: 'github' } });
    
    const clearButton = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('weather')).toBeInTheDocument();
  });

  it('clears search when clear search button in no results is clicked', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search skills by name or description/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Click the clear button in the no-results section
    const noResultsSection = screen.getByText('No skills match your search.').closest('.skills-no-results');
    const clearButton = noResultsSection?.querySelector('button');
    expect(clearButton).toHaveTextContent(/Clear Search/i);
    fireEvent.click(clearButton!);
    
    expect(searchInput).toHaveValue('');
    expect(screen.getByText('github')).toBeInTheDocument();
  });

  it('search is case insensitive', () => {
    mockUseSkills.mockReturnValue({
      data: mockSkills,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SkillsPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search skills by name or description/i);
    fireEvent.change(searchInput, { target: { value: 'GITHUB' } });
    
    expect(screen.getByText('github')).toBeInTheDocument();
  });
});
