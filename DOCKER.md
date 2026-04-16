# Docker Setup for Life Calendar

This guide explains how to build and run the Life Calendar application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will:
1. Build the Docker image
2. Start the container
3. Expose the app at `http://localhost:3000`

### Access the Application

- Web: http://localhost:3000
- Stop: `Ctrl+C` or `docker-compose down`

## Manual Docker Commands

### Build the Image

```bash
docker build -t life-calendar:latest .
```

### Run the Container

```bash
docker run -p 3000:3000 --name life-calendar-app life-calendar:latest
```

### View Running Containers

```bash
docker ps
```

### Stop the Container

```bash
docker stop life-calendar-app
```

### Remove the Container

```bash
docker rm life-calendar-app
```

## Docker Architecture

### Dockerfile (Multi-Stage Build)

The `Dockerfile` uses a multi-stage build approach:

1. **Builder Stage**: 
   - Installs dependencies
   - Builds the Next.js application
   - Creates optimized production bundle

2. **Production Stage**:
   - Uses lightweight Alpine Linux
   - Copies only built artifacts and production dependencies
   - Runs as non-root user (nextjs) for security
   - Includes health checks

### Image Specifications

- **Base Image**: `node:20-alpine` (lightweight, ~170MB)
- **Package Manager**: pnpm
- **Exposed Port**: 3000
- **Health Check**: Every 30 seconds with 3 retries
- **User**: Non-root user (nextjs:1001) for security

## Environment Variables

The application runs in production mode by default:

```yaml
NODE_ENV=production
```

### Custom Environment Variables

To pass custom environment variables, update `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - MY_CUSTOM_VAR=value
```

Or pass them on the command line:

```bash
docker run -e MY_CUSTOM_VAR=value -p 3000:3000 life-calendar:latest
```

## Volumes & Persistence

The current setup doesn't mount volumes (stateless). If you need persistent storage:

1. Create a volume:
```bash
docker volume create life-calendar-data
```

2. Update `docker-compose.yml`:
```yaml
volumes:
  - life-calendar-data:/app/data
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker logs life-calendar-app
```

### Port Already in Use

Change the port in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Access at localhost:3001
```

### Build Failures

Clear Docker cache and rebuild:
```bash
docker system prune -a
docker-compose up --build
```

### Check Health Status

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Production Deployment

### Build for Production

```bash
docker build -t myregistry/life-calendar:1.0.0 .
docker push myregistry/life-calendar:1.0.0
```

### Kubernetes Deployment Example

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: life-calendar
spec:
  replicas: 3
  selector:
    matchLabels:
      app: life-calendar
  template:
    metadata:
      labels:
        app: life-calendar
    spec:
      containers:
      - name: life-calendar
        image: myregistry/life-calendar:1.0.0
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Performance Optimization

### Current Optimizations

- Multi-stage build reduces final image size (~300MB)
- Alpine Linux base saves ~200MB vs full Node.js
- Production dependencies only (no dev dependencies)
- Non-root user improves security

### Further Optimization

For extreme size reduction, use `node:20-alpine AS runtime`:

```dockerfile
# After production stage
FROM node:20-alpine AS runtime
COPY --from=app /app/.next ./app/.next
COPY --from=app /app/public ./app/public
COPY --from=app /app/package.json ./app/package.json
...
```

## Security Considerations

✅ **Implemented:**
- Non-root user execution
- Alpine Linux (smaller attack surface)
- Production dependencies only
- Health checks enabled

🔒 **Best Practices:**
- Use specific version tags (not `latest`)
- Scan images for vulnerabilities: `docker scan life-calendar:latest`
- Use private registry for production images
- Keep Node.js image updated regularly

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: myregistry/life-calendar:${{ github.sha }}
```

## Common Tasks

### View Image Details

```bash
docker inspect life-calendar:latest
```

### View Container Logs

```bash
docker logs -f life-calendar-app
```

### Execute Command in Running Container

```bash
docker exec -it life-calendar-app sh
```

### Check Disk Usage

```bash
docker system df
```

## Cleanup

Remove all unused Docker resources:

```bash
docker system prune -a --volumes
```

## Support

For issues, check:
- Container logs: `docker logs life-calendar-app`
- Docker daemon: `docker ps` (if fails, Docker isn't running)
- See DEPLOYMENT.md for additional deployment strategies
