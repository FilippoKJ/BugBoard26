FROM node:22-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache su-exec \
    && corepack enable \
    && pnpm install --frozen-lockfile --prod
COPY src ./src
COPY database/migrations ./database/migrations
COPY docker-entrypoint.sh /usr/local/bin/bugboard-entrypoint
RUN mkdir -p /app/database /data \
    && chown -R node:node /app /data \
    && chmod 0755 /usr/local/bin/bugboard-entrypoint

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/bugboard-entrypoint"]
CMD ["node", "src/server.js"]
