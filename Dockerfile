FROM node:22.19.0-alpine AS app

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci --include=optional

COPY . .

# Turnstile site key is inlined at build time; Railway passes it as a build arg.
ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

RUN npm run build

ENV PORT=4173
EXPOSE 4173

CMD ["sh", "-c", "npm run start"]
