FROM node:22-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod
COPY src ./src
COPY database/migrations ./database/migrations
RUN mkdir -p /app/database /data \
    && chown -R node:node /app /data

ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
