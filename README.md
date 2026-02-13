# ClawDocs

OpenClaw agent documentation system. Automatically scans and documents all agents, their capabilities, skills, models, and tools, served via a web dashboard.

**Live URL:** https://clawdocs.setrox.com.tr

## Features

- **Automatic Agent Scanning**: Discovers and documents all OpenClaw agents from the system
- **Skill Documentation**: Catalogs all available skills with descriptions and metadata
- **Tool Inventory**: Lists all tools available to agents
- **Interactive Dashboard**: Modern React-based web interface with search and filtering
- **Real-time Data**: Always up-to-date information from live system scans
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Easy on the eyes with a modern dark UI

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: CSS with CSS variables for theming
- **Testing**: Vitest + React Testing Library (frontend), Node.js test runner (backend)
- **Package Management**: npm workspaces

## Project Structure

```
clawdocs/
├── backend/              # Express API server
│   ├── src/
│   │   ├── scanner/      # Agent and skill scanners
│   │   ├── routes/       # API route handlers
│   │   ├── server.ts     # Express server setup
│   │   └── index.ts      # Entry point
│   └── tests/            # Backend tests
├── frontend/             # React dashboard
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── api/          # API client
│   │   └── App.tsx       # Main app component
│   └── tests/            # Frontend tests
├── shared/               # Shared types and utilities
│   └── src/
│       └── types.ts      # TypeScript interfaces
├── package.json          # Root workspace configuration
└── clawdocs.service      # Systemd service file
```

## Prerequisites

- Node.js 20+ 
- npm 10+
- OpenClaw installed at `/usr/lib/node_modules/openclaw`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd clawdocs
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Available Scripts

### Root Level

| Script | Description |
|--------|-------------|
| `npm run build` | Build all workspaces (shared → frontend → backend) |
| `npm run serve` | Start production server |
| `npm run dev` | Start development servers (backend + frontend concurrently) |
| `npm run typecheck` | Run TypeScript type checking across all workspaces |
| `npm run test` | Run backend tests |

### Backend

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript |
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run build` | Build for production (outputs to `backend/public`) |
| `npm run dev` | Start development server (port 3504) |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## API Endpoints

### Health Check

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/health` | Service health status | `{"status": "ok", "service": "clawdocs"}` |

### Agents

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/agents` | List all agents | Array of Agent objects |
| GET | `/api/agents/:id` | Get agent by ID | Single Agent object or 404 |

**Agent Object:**
```json
{
  "id": "developer",
  "name": "Developer",
  "role": "Implements feature changes",
  "model": "kimi-coding/k2p5",
  "description": "A developer agent that implements features...",
  "skills": [...],
  "tools": [...],
  "lastUpdated": "2026-02-13T04:30:00.000Z"
}
```

### Skills

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/skills` | List all skills | Array of Skill objects |
| GET | `/api/skills/:name` | Get skill by name | Single Skill object or 404 |

**Skill Object:**
```json
{
  "id": "github",
  "name": "github",
  "description": "Interact with GitHub using the gh CLI...",
  "location": "/usr/lib/node_modules/openclaw/skills/github",
  "metadata": {
    "version": "1.0.0",
    "author": "OpenClaw",
    "tags": ["git", "github", "version-control"]
  }
}
```

## Development Setup

1. Start the development servers:
```bash
npm run dev
```

This starts:
- Backend API server on port 4504
- Frontend dev server on port 3504

2. Open http://localhost:3504 in your browser

3. Make changes - both servers support hot reload

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Production Setup

### Build

```bash
npm run build
```

This:
1. Builds shared types package
2. Builds frontend (outputs to `backend/public/`)
3. Compiles backend TypeScript

### Start Production Server

```bash
npm run serve
```

Server runs on port 4504 and serves both API and static frontend files.

### Systemd Service

A systemd service file is included for production deployment:

```bash
# Copy service file
sudo cp clawdocs.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service (auto-start on boot)
sudo systemctl enable clawdocs

# Start service
sudo systemctl start clawdocs

# Check status
sudo systemctl status clawdocs
```

**Service Configuration:**
- Runs as `setrox` user
- Working directory: `/home/setrox/clawdocs`
- Port: 4504
- Auto-restarts on failure
- Security hardening enabled

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 4504 | Backend server port |
| `FRONTEND_PORT` | 3504 | Frontend dev server port (development only) |
| `NODE_ENV` | development | Environment mode |

## Pages

- **Dashboard** (`/`) - Overview with statistics and quick links
- **Agents** (`/agents`) - List all agents with search functionality
- **Skills** (`/skills`) - List all skills with filtering

## Components

- **AgentCard** - Displays agent summary with avatar and badges
- **AgentDetail** - Modal showing full agent information
- **SkillCard** - Displays skill information with system/user badges
- **SearchBar** - Reusable search input with clear button
- **StatCard** - Dashboard statistics display
- **Layout** - Main application layout with sidebar navigation

## License

MIT
