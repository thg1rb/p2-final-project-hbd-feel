# FROM node:25-alpine

# WORKDIR /app
# COPY package.json yarn.lock* ./
# RUN yarn install
# COPY . .
# EXPOSE 3000

# CMD ["yarn", "dev", "--host"]

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files ก่อน (เพื่อใช้ cache)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# รับค่าจาก build args
ARG PUBLIC_BROWSER_API_BASE_URL
ARG PUBLIC_DOCKER_API_BASE_URL

# Set เป็น env ให้ตอน build
ENV PUBLIC_BROWSER_API_BASE_URL=$PUBLIC_BROWSER_API_BASE_URL
ENV PUBLIC_DOCKER_API_BASE_URL=$PUBLIC_DOCKER_API_BASE_URL

# Copy source code และ Build
COPY . .
RUN yarn build

# ---------- Stage 2: Production Run ----------
FROM node:20-alpine

WORKDIR /app

# Copy ไฟล์ที่จำเป็นจาก Stage 1 มาใช้
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# SvelteKit (Node Adapter) ใช้พอร์ต 3000 เป็นค่าเริ่มต้น
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# รัน Server ด้วย Node.js
CMD ["node", "build/index.js"]