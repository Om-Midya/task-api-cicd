# Task Management API - DevOps CI/CD Project

A simple REST API for managing tasks, built with Node.js/TypeScript and featuring a complete CI/CD pipeline using GitHub Actions.

## Project Overview

This project demonstrates a production-grade CI/CD pipeline with:

- **Continuous Integration** - Automated builds and tests on every push
- **Code Quality** - ESLint for coding standards
- **Security Scanning** - SAST (CodeQL), SCA (npm audit), Container scanning (Trivy)
- **Containerization** - Docker multi-stage builds
- **Registry Publishing** - Automated push to DockerHub
- **Continuous Deployment** - Kubernetes deployment with CD pipeline

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 20 |
| Language | TypeScript |
| Framework | Express.js |
| Testing | Jest + Supertest |
| Linting | ESLint |
| Container | Docker (multi-stage) |
| CI/CD | GitHub Actions |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API info |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Local Development

### Prerequisites

- Node.js 20+
- npm
- Docker (optional, for container testing)

### Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Testing the API

```bash
# Health check
curl http://localhost:3000/health

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn CI/CD", "description": "Complete DevOps project"}'

# Get all tasks
curl http://localhost:3000/api/tasks
```

## Docker

### Build Image

```bash
docker build -t task-api .
```

### Run Container

```bash
docker run -p 3000:3000 task-api
```

### Test Container

```bash
curl http://localhost:3000/health
```

## CI/CD Pipeline

The pipeline is defined in `.github/workflows/ci.yml` and includes the following stages:

### Pipeline Stages

| Stage | Tool | Purpose |
|-------|------|---------|
| Checkout | actions/checkout | Retrieve source code |
| Setup Node.js | actions/setup-node | Install runtime |
| Install | npm ci | Install dependencies |
| Lint | ESLint | Enforce coding standards |
| Test | Jest | Validate business logic |
| SAST | CodeQL | Find code vulnerabilities |
| SCA | npm audit | Find dependency vulnerabilities |
| Build | tsc | Compile TypeScript |
| Docker Build | docker/build-push-action | Create container |
| Image Scan | Trivy | Scan for container vulnerabilities |
| Runtime Test | curl | Verify container health |
| Push | docker/build-push-action | Publish to DockerHub |

### Triggers

- Push to `main` or `master` branch
- Manual trigger via GitHub UI (workflow_dispatch)

## GitHub Secrets Configuration

Configure the following secrets in your GitHub repository (Settings > Secrets > Actions):

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Your DockerHub username |
| `DOCKERHUB_TOKEN` | DockerHub access token (not password) |

### How to Create DockerHub Token

1. Log in to [DockerHub](https://hub.docker.com)
2. Go to Account Settings > Security
3. Click "New Access Token"
4. Give it a name (e.g., "GitHub Actions")
5. Copy the token and add it as `DOCKERHUB_TOKEN` secret in GitHub

## Kubernetes Deployment

### Prerequisites

- Docker Desktop with Kubernetes enabled (kind cluster)
- kubectl CLI

### Deploy to Local Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Check deployment status
kubectl get pods
kubectl get services

# Access the application
kubectl port-forward svc/task-api-service 8080:80

# Test the deployment
curl http://localhost:8080/health
```

### CD Pipeline

The CD pipeline (`.github/workflows/cd.yml`) is triggered automatically after CI passes. It:
1. Validates Kubernetes manifests
2. Provides deployment artifacts
3. Includes DAST scan placeholder

## Project Structure

```
project-root/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline
│       └── cd.yml          # CD pipeline
├── k8s/
│   ├── deployment.yaml     # Kubernetes Deployment
│   └── service.yaml        # Kubernetes Service
├── src/
│   ├── index.ts            # Entry point
│   ├── app.ts              # Express app
│   ├── routes/
│   │   └── tasks.ts        # API routes
│   ├── controllers/
│   │   └── taskController.ts
│   ├── services/
│   │   └── taskService.ts  # Business logic
│   └── models/
│       └── task.ts         # Type definitions
├── tests/
│   └── tasks.test.ts       # Unit tests
├── Dockerfile              # Container definition
├── package.json
├── tsconfig.json
└── README.md
```

## Why Each CI Stage Matters

| Stage | Why It Matters |
|-------|----------------|
| Linting | Prevents technical debt and maintains code consistency |
| Unit Tests | Catches bugs before they reach production |
| SAST (CodeQL) | Detects security vulnerabilities like SQL injection, XSS |
| SCA (npm audit) | Identifies vulnerable third-party dependencies |
| Docker Build | Ensures application can be containerized |
| Image Scan (Trivy) | Prevents shipping containers with known vulnerabilities |
| Runtime Test | Verifies the container actually starts and responds |
| Registry Push | Makes image available for deployment |

## Security Considerations

- Non-root user in Docker container
- Multi-stage builds (smaller attack surface)
- Health checks for container orchestration
- Secrets stored in GitHub Secrets (never committed)
- Automated security scanning on every push

## License

MIT
