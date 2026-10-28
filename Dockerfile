# Buildthatset: statische Astro-site, geserveerd door nginx. Klaar voor Coolify (build pack: Dockerfile, poort 80).
# Build-variabelen (in Coolify als build variable aanvinken): SITE_URL, GTM_ID, NOINDEX.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG SITE_URL
ARG GTM_ID
ARG NOINDEX
ENV SITE_URL=$SITE_URL GTM_ID=$GTM_ID NOINDEX=$NOINDEX
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
