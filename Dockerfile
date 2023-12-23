# Use a single stage to build the application

# Start with a Node.js 18 Alpine image
FROM node:18-alpine AS builder

# Install any necessary system dependencies
RUN apk add --no-cache libc6-compat

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn --frozen-lockfile

# Copy the rest of your application's code
COPY . .

# Build your Next.js application
# Uncomment to disable Next.js telemetry during the build
# ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Set the environment to production
ENV NODE_ENV production

# Uncomment to disable Next.js telemetry at runtime
# ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user and set file permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

# Set up the production directories
COPY --chown=nextjs:nodejs /app/public ./public
COPY --chown=nextjs:nodejs /app/.next/standalone ./
COPY --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3000

# Set the environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the Next.js application using yarn start
CMD ["yarn", "start"]
