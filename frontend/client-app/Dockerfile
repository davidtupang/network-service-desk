FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npx", "serve", "dist", "-s", "-l", "3002"]
