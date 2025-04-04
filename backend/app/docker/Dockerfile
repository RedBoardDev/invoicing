FROM node:18 AS builder

WORKDIR /app

COPY ../../package*.json ../../tsconfig*.json ./

RUN npm install

COPY ../../prisma ./prisma

RUN npx prisma generate

COPY ../../app ./app

FROM node:18 AS production

WORKDIR /app

COPY --from=builder /app /app

RUN npm install -g prisma

EXPOSE 3000

CMD ["sh", "-c", "npm run dev"]
