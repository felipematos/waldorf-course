# Quick Start Guide

## Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Claude Code CLI (optional but recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd waldorf-course
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Initialize Claude-Flow (already done):
```bash
npx claude-flow@latest init --sparc
```

## Development

### Start development server:
```bash
npm run dev
```

### Run tests:
```bash
npm test
```

### SPARC Development Workflow:
```bash
# Analyze a task
./claude-flow sparc "implement user authentication"

# Run TDD workflow
./claude-flow sparc tdd "create login component"

# Start a swarm for complex tasks
./claude-flow swarm "refactor database layer" --strategy optimization
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run all tests
- `npm run lint` - Run linter
- `npm run typecheck` - Check TypeScript types
- `npm run sparc` - Run SPARC orchestrator
- `npm run swarm` - Start swarm coordination
- `npm run monitor` - Monitor system status

## Claude-Flow Commands
- `./claude-flow start` - Start orchestration
- `./claude-flow status` - Check status
- `./claude-flow agent spawn <type>` - Create agent
- `./claude-flow task create <type> "description"` - Create task
- `./claude-flow memory store "key" "value"` - Store data