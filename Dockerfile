# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install

COPY . .
RUN yarn build


# -------- Stage 2: Serve --------
FROM nginx:alpine

# ลบ default config
RUN rm -rf /usr/share/nginx/html/*

# copy build output
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]