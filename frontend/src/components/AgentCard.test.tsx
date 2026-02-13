/**
 * Tests for AgentCard component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentCard } from './AgentCard';
import type { Agent } from '@clawdocs/shared';

const mockAgent: Agent = {
  id: 'agent-1',
  name: 'TestAgent',
  role: 'Developer',
  model: 'kimi-coding/k2p5',
  description: 'A test agent for development purposes.',
  skills: [
    { id: 'skill-1', name: 'Code', description: 'Code skill', location: '/skills/code' },
    { id: 'skill-2', name: 'Test', description: 'Test skill', location: '/skills/test' },
  ],
  tools: [
    { id: 'tool-1', name: 'read', description: 'Read file' },
    { id: 'tool-2', name: 'write', description: 'Write file' },
    { id: 'tool-3', name: 'exec', description: 'Execute command' },
  ],
  lastUpdated: new Date('2026-02-13'),
};

const mockAgentLongDescription: Agent = {
  ...mockAgent,
  id: 'agent-2',
  name: 'LongDescAgent',
  description: 'This is a very long description that should be truncated. '.repeat(10),
};

describe('AgentCard', () => {
  it('renders agent avatar with first letter of name', () => {
    render(<AgentCard agent={mockAgent} />);
    
    const avatar = screen.getByText('T');
    expect(avatar).toBeInTheDocument();
  });

  it('displays agent name', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText('TestAgent')).toBeInTheDocument();
  });

  it('displays agent role', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('displays model badge', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText('kimi-coding/k2p5')).toBeInTheDocument();
  });

  it('displays truncated description', () => {
    render(<AgentCard agent={mockAgentLongDescription} />);
    
    const description = screen.getByText(/This is a very long description/);
    expect(description).toBeInTheDocument();
    expect(description.textContent).toContain('...');
  });

  it('displays skill count badge', () => {
    render(<AgentCard agent={mockAgent} />);
    
    // Should show "2" for skills
    const skillCount = screen.getByText('2');
    expect(skillCount).toBeInTheDocument();
  });

  it('displays tool count badge', () => {
    render(<AgentCard agent={mockAgent} />);
    
    // Should show "3" for tools
    const toolCount = screen.getByText('3');
    expect(toolCount).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<AgentCard agent={mockAgent} onClick={handleClick} />);
    
    const card = screen.getByRole('button', { name: /View details for TestAgent/ });
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockAgent);
  });

  it('handles keyboard events (Enter)', () => {
    const handleClick = vi.fn();
    render(<AgentCard agent={mockAgent} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Space)', () => {
    const handleClick = vi.fn();
    render(<AgentCard agent={mockAgent} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders without onClick handler', () => {
    render(<AgentCard agent={mockAgent} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    // Should not throw
    expect(card).toBeInTheDocument();
  });

  it('handles agent with empty skills and tools', () => {
    const agentWithNoSkills: Agent = {
      ...mockAgent,
      skills: [],
      tools: [],
    };
    
    render(<AgentCard agent={agentWithNoSkills} />);
    
    // Should show "0" for both
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });

  it('handles agent with undefined skills and tools', () => {
    const agentWithUndefined: Agent = {
      ...mockAgent,
      skills: undefined as unknown as [],
      tools: undefined as unknown as [],
    };
    
    render(<AgentCard agent={agentWithUndefined} />);
    
    // Should show "0" for both
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });
});
