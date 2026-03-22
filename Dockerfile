# Build stage
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-slim
WORKDIR /app

# Install FFmpeg and Fonts
RUN apt-get update && apt-get install -y \
    ffmpeg \
    fonts-dejavu-core \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/free-photo-of-holy-quran-under-sunlight.webp ./

# Ensure directories exist
RUN mkdir -p outputs temp assets/backgrounds

RUN npm install --omit=dev

EXPOSE 8000
ENV PORT=8000
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
