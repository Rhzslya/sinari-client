# client/Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 5173

# PENTING: Tambahkan --host agar bisa diakses dari browser luar container
CMD ["bun", "run", "dev", "--", "--host"]