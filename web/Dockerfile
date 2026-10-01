# The web image: the built single-page app behind nginx, which also proxies /api to the backend so
# the browser sees one origin (the session cookie never leaves it).
FROM node:24-alpine AS build
WORKDIR /web
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
# Pick up the operating system security fixes published since the base image was built.
USER root
RUN apk upgrade --no-cache
USER 101
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /web/dist /usr/share/nginx/html
EXPOSE 8080
