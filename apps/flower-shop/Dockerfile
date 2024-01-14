FROM registry.ascvn.vn/dockerhub/library/node:16 AS build
WORKDIR /src
COPY ../../decorate-angular-cli.js ./
COPY ../../package*.json ./
RUN npm install --legacy-peer-deps
COPY ../../ .
RUN npm run build:admin

FROM registry.ascvn.vn/dockerhub/library/nginx:1.21.4
COPY ../../nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist/apps/flower-shop /usr/share/nginx/html
