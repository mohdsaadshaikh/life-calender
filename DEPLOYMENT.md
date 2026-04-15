# Deployment Guide

This guide covers deploying Life Calendar to various hosting platforms.

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All TypeScript errors are fixed (`pnpm build` passes)
- [ ] ESLint passes (`pnpm lint`)
- [ ] All tests pass (`pnpm test`)
- [ ] No console errors or warnings
- [ ] Performance audit is acceptable (Lighthouse 80+)
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] No hardcoded secrets or API keys in code
- [ ] Environment variables are configured
- [ ] Mobile responsive design is tested
- [ ] Cross-browser testing is complete

## Environment Variables

### Required Variables

Create a `.env.local` file in the project root:

```bash
# .env.local (Not committed to version control)
NEXT_PUBLIC_APP_NAME=Life Calendar
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SITE_URL=https://life-calendar.app
```

### Example `.env.example`

```bash
# Copy this file to .env.local and fill in your values
NEXT_PUBLIC_APP_NAME=Life Calendar
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SITE_URL=https://localhost:3000
```

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is the official deployment platform for Next.js applications and is recommended for this project.

#### Prerequisites

- Vercel account ([sign up free](https://vercel.com/signup))
- Git repository (GitHub, GitLab, or Bitbucket)

#### Steps

1. **Push code to Git repository**
   ```bash
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to https://vercel.com/new
   - Select your Git repository
   - Configure project settings (usually defaults are fine)
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Settings > Environment Variables
   - Add production environment variables
   - Redeploy if needed

4. **Domain Configuration**
   - Go to Settings > Domains
   - Add your custom domain (optional)
   - Follow DNS instructions

5. **Automatic Deployments**
   - Every push to `main` branch triggers automatic deployment
   - Preview deployments for pull requests

#### Vercel-Specific Features

- **Automatic HTTPS**: SSL certificate is managed by Vercel
- **Performance Monitoring**: Built-in analytics and speed insights
- **Preview URLs**: Each PR gets a preview deployment
- **Edge Middleware**: Can add global middleware if needed
- **Analytics**: Visit https://vercel.com/analytics for insights

**Estimated Time**: 5-10 minutes

### Option 2: Netlify

#### Prerequisites

- Netlify account ([sign up free](https://netlify.com))
- Git repository

#### Steps

1. **Create build configuration**

   Create `netlify.toml` in project root:
   ```toml
   [build]
   command = "pnpm build"
   functions = "netlify/functions"
   publish = ".next"

   [build.environment]
   NODE_VERSION = "18"
   PNPM_VERSION = "8"

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

2. **Push to Git repository**
   ```bash
   git push origin main
   ```

3. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: `pnpm build`
     - Publish directory: `.next/static`
   - Click "Deploy"

4. **Configure Environment Variables**
   - Go to Site Settings > Build & Deploy > Environment
   - Add production variables
   - Trigger redeploy

5. **Configure Domain**
   - Go to Site Settings > Domain settings
   - Add your custom domain (optional)

**Estimated Time**: 10-15 minutes

### Option 3: Self-Hosted (VPS/Server)

For more control over your infrastructure.

#### Prerequisites

- Linux VPS or server (Ubuntu 20.04+ recommended)
- SSH access
- Node.js 18+ installed
- pnpm or npm installed
- Domain name (optional)
- SSL certificate (Let's Encrypt recommended)

#### Steps

1. **Connect to Server**
   ```bash
   ssh user@your-server.com
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js (if not already installed)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install pnpm
   npm install -g pnpm
   
   # Install PM2 for process management
   npm install -g pm2
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/life-calendar.git
   cd life-calendar
   ```

4. **Install Project Dependencies**
   ```bash
   pnpm install
   ```

5. **Build Application**
   ```bash
   pnpm build
   ```

6. **Create Environment File**
   ```bash
   nano .env.local
   # Add your environment variables
   # Press Ctrl+O to save, then Ctrl+X to exit
   ```

7. **Start Application with PM2**
   ```bash
   pm2 start "pnpm start" --name "life-calendar"
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/default
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

10. **Setup Auto-Renewal**
    ```bash
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    ```

11. **Setup Auto-Deploy (Optional)**
    
    Create a webhook handler for automatic deployments on push:
    ```bash
    # Create deploy script
    nano ~/deploy.sh
    ```

    ```bash
    #!/bin/bash
    cd /var/www/life-calendar
    git pull origin main
    pnpm install
    pnpm build
    pm2 restart life-calendar
    ```

    ```bash
    chmod +x ~/deploy.sh
    ```

    Set up GitHub webhook to trigger this script on push.

**Estimated Time**: 30-45 minutes

### Option 4: Docker

Deploy using Docker containers.

#### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy built application from builder
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

EXPOSE 3000

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Create docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_NAME=Life Calendar
    restart: unless-stopped
```

#### Build and Run

```bash
# Build image
docker build -t life-calendar:1.0.0 .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_NAME="Life Calendar" life-calendar:1.0.0

# Or with docker-compose
docker-compose up -d
```

## Post-Deployment Tasks

### 1. Verify Deployment

```bash
# Test the live site
curl -I https://your-domain.com

# Should return 200 OK
```

### 2. Performance Monitoring

- Check Lighthouse score: https://developers.google.com/speed/pagespeed/insights
- Monitor Core Web Vitals
- Set up performance alerts
- Review error logs regularly

### 3. Set Up Monitoring

#### Sentry (Error Tracking)

```bash
# Install Sentry
pnpm add @sentry/nextjs

# Configure in next.config.mjs
const withSentry = require('@sentry/nextjs').withSentryConfig
```

#### Uptime Monitoring

- Use UptimeRobot or similar service
- Set up alerts for downtime
- Monitor response times

### 4. Backup Strategy

- **Data**: Users' data is stored in browser localStorage (no server backup needed)
- **Code**: Regular Git commits serve as version control
- **Database**: N/A (no server-side database)

### 5. Security Hardening

- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set security headers
- [ ] Enable CSP (Content Security Policy)
- [ ] Update dependencies regularly
- [ ] Run security audits (`npm audit`)

Add security headers in `next.config.mjs`:
```javascript
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
]

async function headers() {
  return [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ]
}
```

## Troubleshooting

### Build Fails

```bash
# Clean build
rm -rf .next node_modules
pnpm install
pnpm build
```

### High Memory Usage

- Check for memory leaks in components
- Optimize large data operations
- Consider enabling serverless functions

### Slow Performance

- Run Lighthouse audit
- Check bundle size: `npm run build && du -sh .next`
- Optimize images
- Enable caching headers

### Environmental Issues

```bash
# Verify environment variables are set
echo $NEXT_PUBLIC_APP_NAME

# Check .env.local is not in git
git check-ignore .env.local
```

## Rollback Procedures

### Vercel
- Visit Deployments page
- Click on previous deployment
- Click "Redeploy"

### Netlify
- Visit Deploys page
- Hover over previous deploy
- Click "Restore"

### Self-Hosted
```bash
cd /var/www/life-calendar
git log --oneline
git checkout <commit-hash>
pnpm build
pm2 restart life-calendar
```

## Continuous Deployment (CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linting
        run: pnpm lint
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Monitoring & Analytics

### Key Metrics to Track

- **Performance**: First Contentful Paint, Largest Contentful Paint
- **Errors**: JavaScript errors, network errors, API failures
- **User Experience**: Page load time, interaction latency
- **Availability**: Uptime percentage, response time

### Tools

- **Vercel Analytics**: https://vercel.com/analytics
- **Google Analytics**: https://analytics.google.com
- **Sentry**: https://sentry.io (error tracking)
- **LogRocket**: https://logrocket.com (session recording)
- **UptimeRobot**: https://uptimerobot.com (uptime monitoring)

## Scaling

If your app grows:

1. **Increase server resources** (for self-hosted)
2. **Enable caching** (Vercel/Netlify handles this)
3. **Use CDN** for static assets
4. **Database optimization** (if moving to server storage)
5. **Load balancing** (for multiple servers)

## Maintenance

### Regular Tasks

- Weekly: Check error logs
- Monthly: Update dependencies, run security audit
- Quarterly: Performance review, accessibility audit
- Annually: Major upgrades, infrastructure review

### Update Dependencies

```bash
# Check for updates
pnpm outdated

# Update packages
pnpm update

# Major version updates (carefully)
pnpm add package@latest
```

## Support

For deployment issues:

- **Vercel Support**: https://vercel.com/support
- **Netlify Support**: https://www.netlify.com/support/
- **Our Issues**: https://github.com/your-username/life-calendar/issues
- **Email**: support@life-calendar.app

---

**Happy deploying!** 🚀
