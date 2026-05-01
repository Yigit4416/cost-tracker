FROM oven/bun:1.3.13 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/package.json frontend/bun.lock ./frontend/
WORKDIR /app/frontend
RUN bun install --frozen-lockfile

WORKDIR /app
COPY . .

WORKDIR /app/frontend
RUN bun run build

FROM oven/bun:1.3.13 AS runtime

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY backend ./backend
COPY tsconfig.json ./tsconfig.json
COPY --from=build /app/frontend/dist ./frontend/dist

USER bun

EXPOSE 3000

CMD ["bun", "backend/index.ts"]
