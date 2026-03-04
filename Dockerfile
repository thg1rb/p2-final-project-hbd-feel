FROM node:25-alpine

WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000

CMD ["yarn", "dev", "--host"]

# # ---------- Stage 1: Build ----------
# FROM node:20-alpine AS builder

# WORKDIR /app

# # copy package files ก่อน (เพื่อใช้ cache)
# COPY package.json yarn.lock ./

# RUN yarn install

# # รับค่าจาก build args
# ARG PUBLIC_BROWSER_API_BASE_URL
# ARG PUBLIC_DOCKER_API_BASE_URL

# # set เป็น env ให้ตอน build
# ENV PUBLIC_BROWSER_API_BASE_URL=$PUBLIC_BROWSER_API_BASE_URL
# ENV PUBLIC_DOCKER_API_BASE_URL=$PUBLIC_DOCKER_API_BASE_URL

# # copy source code
# COPY . .

# # build
# RUN yarn build


# # ---------- Stage 2: Serve ----------
# FROM nginx:alpine

# # ลบ default config
# RUN rm -rf /usr/share/nginx/html/*

# # copy ไฟล์ build จาก stage แรก
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf 
 
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]