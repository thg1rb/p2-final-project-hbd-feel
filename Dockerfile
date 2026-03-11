# ---------- Stage 1: Base (ติดตั้ง Dependencies) ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---------- Stage 2: Development (ใช้สำหรับ Local Dev) ----------
FROM base AS development
COPY . .
# ในโหมด dev เราต้องการรัน yarn dev และให้มัน watch ไฟล์
CMD ["yarn", "dev", "--host", "0.0.0.0"]

# ---------- Stage 3: Builder (สำหรับ Build Production เท่านั้น) ----------
FROM base AS builder
ARG PUBLIC_BROWSER_API_BASE_URL
ARG PUBLIC_DOCKER_API_BASE_URL
ARG PUBLIC_OAUTH_URI
ENV PUBLIC_BROWSER_API_BASE_URL=$PUBLIC_BROWSER_API_BASE_URL
ENV PUBLIC_DOCKER_API_BASE_URL=$PUBLIC_DOCKER_API_BASE_URL
ENV PUBLIC_OAUTH_URI=$PUBLIC_OAUTH_URI


COPY . .
RUN yarn build

# ---------- Stage 4: Production Run (ผลลัพธ์สุดท้ายที่ CICD จะได้) ----------
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build/index.js"]

