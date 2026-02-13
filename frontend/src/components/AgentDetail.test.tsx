/**
 * AgentDetail component tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AgentDetail } from './AgentDetail';
import type { Agent } from '@clawdocs/shared';

describe('AgentDetail', () => {
  const mockOnClose = vi.fn();

  const mockAgent: Agent = {
    id: 'test-agent-1',
    name: 'TestAgent',
    role: 'Test Role',
    model: 'kimi-coding/k2p5',
    description: 'This is a test agent description that provides detailed information about what this agent does.',
    skills: [
      {
        id: 'skill-1',
        name: 'TestSkill',
        description: 'A test skill for testing purposes',
        location: '/test/skill/location',
        metadata: {
          version: '1.0.0',
          author: 'Test Author',
        },
      },
      {
        id: 'skill-2',
        name: 'AnotherSkill',
        description: 'Another test skill without version',
        location: '/another/location',
      },
    ],
    tools: [
      {
        id: 'tool-1',
        name: 'TestTool',
        description: 'A test tool for testing',
      },
    ],
    lastUpdated: new Date('2024-01-01'),
  };

  const mockAgentMinimal: Agent = {
    id: 'minimal-agent',
    name: 'MinimalAgent',
    role: 'Minimal Role',
    model: 'gpt-4',
    description: 'Minimal description',
    skills: [],
    tools: [],
    lastUpdated: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Reset body overflow style
    document.body.style.overflow = '';
  });

  it('renders agent name prominently', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('TestAgent')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'TestAgent' })).toBeInTheDocument();
  });

  it('renders agent role', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('Test Role')).toBeInTheDocument();
  });

  it('renders model badge prominently', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    const modelBadge = screen.getByText('kimi-coding/k2p5');
    expect(modelBadge).toBeInTheDocument();
    expect(modelBadge).toHaveClass('agent-detail-model-badge');
  });

  it('renders full description (not truncated)', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText(mockAgent.description)).toBeInTheDocument();
  });

  it('renders skills list with names and descriptions', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('Skills (2)')).toBeInTheDocument();
    expect(screen.getByText('TestSkill')).toBeInTheDocument();
    expect(screen.getByText('A test skill for testing purposes')).toBeInTheDocument();
    expect(screen.getByText('AnotherSkill')).toBeInTheDocument();
    expect(screen.getByText('Another test skill without version')).toBeInTheDocument();
  });

  it('renders skill version when available', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('renders skill location', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('/test/skill/location')).toBeInTheDocument();
    expect(screen.getByText('/another/location')).toBeInTheDocument();
  });

  it('renders tools list with names and descriptions', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('Tools (1)')).toBeInTheDocument();
    expect(screen.getByText('TestTool')).toBeInTheDocument();
    expect(screen.getByText('A test tool for testing')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close agent details');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close agent details');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    const backdrop = screen.getByTestId('agent-detail-backdrop');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    const modalContent = screen.getByRole('dialog');
    // Click on the modal itself (not the backdrop)
    const modalInner = modalContent.querySelector('.agent-detail-modal');
    if (modalInner) {
      fireEvent.click(modalInner);
    }
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('prevents body scroll when mounted', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when unmounted', () => {
    const { unmount } = render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('');
  });

  it('renders avatar with first letter of agent name', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    const avatar = screen.getByText('T');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('agent-detail-avatar');
  });

  it('renders skill and tool counts in stats section', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Skills count
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Tools count
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('handles agent with no skills', () => {
    render(<AgentDetail agent={mockAgentMinimal} onClose={mockOnClose} />);
    
    // The stats section still shows "Skills" label with count 0
    // But the Skills section with the list should not appear
    expect(screen.queryByText('Skills (0)')).not.toBeInTheDocument();
  });

  it('handles agent with no tools', () => {
    render(<AgentDetail agent={mockAgentMinimal} onClose={mockOnClose} />);
    
    // The stats section still shows "Tools" label with count 0
    // But the Tools section with the list should not appear
    expect(screen.queryByText('Tools (0)')).not.toBeInTheDocument();
  });

  it('shows empty state when no skills or tools', () => {
    render(<AgentDetail agent={mockAgentMinimal} onClose={mockOnClose} />);
    
    expect(screen.getByText('No skills or tools configured for this agent.')).toBeInTheDocument();
  });

  it('has correct ARIA attributes for accessibility', () => {
    render(<AgentDetail agent={mockAgent} onClose={mockOnClose} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'agent-detail-title');
  });

  it('renders agent with long description correctly', () => {
    const longDescAgent: Agent = {
      ...mockAgent,
      description: 'A'.repeat(1000),
    };
    
    render(<AgentDetail agent={longDescAgent} onClose={mockOnClose} />);
    
    expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument();
  });

  it('renders skills without metadata correctly', () => {
    const agentWithoutSkillMetadata: Agent = {
      ...mockAgent,
      skills: [
        {
          id: 'skill-no-meta',
          name: 'NoMetaSkill',
          description: 'Skill without metadata',
          location: '/location',
        },
      ],
    };
    
    render(<AgentDetail agent={agentWithoutSkillMetadata} onClose={mockOnClose} />);
    
    expect(screen.getByText('NoMetaSkill')).toBeInTheDocument();
    expect(screen.queryByText(/v\d+\.\d+/)).not.toBeInTheDocument();
  });

  it('renders tools without parameters correctly', () => {
    const agentWithToolNoParams: Agent = {
      ...mockAgent,
      tools: [
        {
          id: 'tool-no-params',
          name: 'SimpleTool',
          description: 'Simple tool without parameters',
        },
      ],
    };
    
    render(<AgentDetail agent={agentWithToolNoParams} onClose={mockOnClose} />);
    
    expect(screen.getByText('SimpleTool')).toBeInTheDocument();
    expect(screen.getByText('Simple tool without parameters')).toBeInTheDocument();
  });
});
