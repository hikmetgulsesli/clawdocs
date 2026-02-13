/**
 * Tests for SkillCard component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillCard } from './SkillCard';
import type { Skill } from '@clawdocs/shared';

const mockSystemSkill: Skill = {
  id: 'skill-1',
  name: 'github',
  description: 'Interact with GitHub using the gh CLI.',
  location: '/usr/lib/node_modules/openclaw/skills/github',
  metadata: {
    version: '1.0.0',
    author: 'OpenClaw',
  },
};

const mockUserSkill: Skill = {
  id: 'skill-2',
  name: 'my-custom-skill',
  description: 'A custom user skill for personal use.',
  location: 'user:/home/setrox/.openclaw/skills/my-custom-skill',
  metadata: {
    version: '0.1.0',
  },
};

const mockSkillLongDescription: Skill = {
  ...mockSystemSkill,
  id: 'skill-3',
  name: 'LongDescSkill',
  description: 'This is a very long description that should be truncated. '.repeat(10),
};

const mockSkillNoDescription: Skill = {
  ...mockSystemSkill,
  id: 'skill-4',
  name: 'NoDescSkill',
  description: '',
};

describe('SkillCard', () => {
  it('renders skill name', () => {
    render(<SkillCard skill={mockSystemSkill} />);
    
    expect(screen.getByText('github')).toBeInTheDocument();
  });

  it('displays skill description', () => {
    render(<SkillCard skill={mockSystemSkill} />);
    
    expect(screen.getByText('Interact with GitHub using the gh CLI.')).toBeInTheDocument();
  });

  it('displays truncated description', () => {
    render(<SkillCard skill={mockSkillLongDescription} />);
    
    const description = screen.getByText(/This is a very long description/);
    expect(description).toBeInTheDocument();
    expect(description.textContent).toContain('...');
  });

  it('shows "No description available" for empty description', () => {
    render(<SkillCard skill={mockSkillNoDescription} />);
    
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('displays system badge for system skills', () => {
    render(<SkillCard skill={mockSystemSkill} />);
    
    const badge = screen.getByText('System');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('system-badge');
  });

  it('displays user badge for user skills', () => {
    render(<SkillCard skill={mockUserSkill} />);
    
    const badge = screen.getByText('User');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('user-badge');
  });

  it('displays skill location path', () => {
    render(<SkillCard skill={mockSystemSkill} />);
    
    expect(screen.getByText('/usr/lib/node_modules/openclaw/skills/github')).toBeInTheDocument();
  });

  it('removes user: prefix from location display', () => {
    render(<SkillCard skill={mockUserSkill} />);
    
    // Should show path without "user:" prefix
    expect(screen.getByText('/home/setrox/.openclaw/skills/my-custom-skill')).toBeInTheDocument();
    // Should NOT show the "user:" prefix
    expect(screen.queryByText('user:/home/setrox/.openclaw/skills/my-custom-skill')).not.toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<SkillCard skill={mockSystemSkill} onClick={handleClick} />);
    
    const card = screen.getByRole('button', { name: /View details for github/ });
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockSystemSkill);
  });

  it('handles keyboard events (Enter)', () => {
    const handleClick = vi.fn();
    render(<SkillCard skill={mockSystemSkill} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Space)', () => {
    const handleClick = vi.fn();
    render(<SkillCard skill={mockSystemSkill} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders without onClick handler', () => {
    render(<SkillCard skill={mockSystemSkill} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    // Should not throw
    expect(card).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<SkillCard skill={mockSystemSkill} />);
    
    const card = screen.getByRole('button', { name: /View details for github/ });
    expect(card).toBeInTheDocument();
  });
});
