FROM node:22.19.0-alpine AS app

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci --include=optional

COPY . .
RUN npm run build

ENV PORT=4173
EXPOSE 4173

CMD ["sh", "-c", "npm run start"]
