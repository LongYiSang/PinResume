FROM node:24-alpine AS base

WORKDIR /app

COPY . .

RUN if [ -f package.json ]; then npm install; fi

CMD ["npm", "run", "dev"]
