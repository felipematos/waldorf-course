# Example SPARC Workflow

## Creating a New Feature with TDD

### 1. Start with Specification
```bash
./claude-flow sparc run spec-pseudocode "user authentication with JWT"
```

### 2. Design Architecture
```bash
./claude-flow sparc run architect "authentication service architecture"
```

### 3. Implement with TDD
```bash
./claude-flow sparc tdd "implement JWT authentication"
```

### 4. Optimize and Refine
```bash
./claude-flow sparc run refinement-optimization-mode "optimize auth performance"
```

### 5. Document
```bash
./claude-flow sparc run docs-writer "document authentication API"
```

## Working with Swarms

### Complex Task Example
```bash
# Start a development swarm for a large feature
./claude-flow swarm "build complete user management system" \
  --strategy development \
  --agents 5 \
  --monitor \
  --review
```

### Parallel Execution
```bash
# Execute multiple tasks in parallel
./claude-flow sparc batch "architect,tdd,docs-writer" \
  "create REST API for course management"
```

## Memory Management

### Store Project Context
```bash
./claude-flow memory store "project_architecture" \
  "Microservices with API Gateway pattern" \
  --namespace architecture

./claude-flow memory store "api_endpoints" \
  "GET /courses, POST /courses, PUT /courses/:id" \
  --namespace api
```

### Retrieve Context
```bash
./claude-flow memory query "architecture" --namespace project
```

## Agent Coordination

### Spawn Specialized Agents
```bash
# Research agent
./claude-flow agent spawn researcher \
  --name "Requirements Analyst" \
  --priority 9

# Development agent
./claude-flow agent spawn coder \
  --name "Senior Developer" \
  --capabilities "TypeScript,React,Node.js"

# Testing agent
./claude-flow agent spawn tester \
  --name "QA Engineer" \
  --capabilities "Jest,E2E,Performance"
```

### Monitor Progress
```bash
./claude-flow monitor --interval 2 --duration 30
```

## Complete Pipeline Example

```bash
# Full pipeline for new feature
./claude-flow sparc pipeline "implement course enrollment system" \
  --stages "spec,architect,tdd,optimize,document" \
  --parallel \
  --monitor \
  --export-results
```

## Tips
- Use `--parallel` for faster execution
- Store important context in memory for persistence
- Monitor long-running tasks with `--monitor`
- Export results for documentation with `--export-results`
- Use swarms for complex, multi-faceted tasks