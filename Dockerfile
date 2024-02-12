# Use the base image with Node.js 18
FROM 192.168.0.5:8082/node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install libc6-compat if needed
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Set Verdaccio (Nexus) as the npm registry
RUN npm config set registry http://192.168.0.5:8081/repository/npmg/

# Install dependencies with custom handling for missing packages
RUN npm install || \
  for pkg in $(jq -r '.dependencies | to_entries[] | .key + "@" + .value' package.json); do \
    npm install "$pkg" || echo "$pkg" >> missing_packages.txt; \
  done

# Check and display missing packages
RUN if [ -f missing_packages.txt ] && [ -s missing_packages.txt ]; then \
      echo "The following packages were not found and need to be uploaded to Nexus:" && \
      cat missing_packages.txt; \
    else \
      echo "All packages found and installed successfully."; \
    fi
# Install dependencies
# Check the lock file to determine which package manager to use
#RUN \
#  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#  elif [ -f package-lock.json ]; then npm ci; \
#  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
#  else echo "Lockfile not found." && exit 1; \
#  fi

# Continue with the original Dockerfile content...

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app
RUN yarn build

# Set up the production environment
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Set up user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use the created user
USER nextjs

# Expose and run the app
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
