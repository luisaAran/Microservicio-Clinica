FROM node:25-alpine AS builder
WORKDIR /src
RUN apk add --no-cache build-base python3
RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY src ./src
COPY tsconfig.json ./
COPY drizzle.config.ts ./
EXPOSE 3000
CMD ["pnpm", "run", "dev"]