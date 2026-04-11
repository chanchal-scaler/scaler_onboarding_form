FROM node:22.19.0-alpine AS app

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci --include=optional

COPY . .

# Vite env vars are inlined at build time; pass as docker build args (e.g. Railway).
ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

ARG VITE_MIXPANEL_TOKEN
ENV VITE_MIXPANEL_TOKEN=$VITE_MIXPANEL_TOKEN

RUN npm run build

ENV PORT=4173
EXPOSE 4173

CMD ["sh", "-c", "npm run start"]
