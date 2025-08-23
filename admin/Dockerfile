FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .


ARG VITE_API_URL
ARG VITE_DEFAULT_DOMAIN
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DEFAULT_DOMAIN=$VITE_DEFAULT_DOMAIN

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build/client /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]