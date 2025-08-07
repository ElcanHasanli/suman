# react/Dockerfile

# Base image
FROM nginx:stable-alpine

# Build edilmiş faylları Nginx-in host etdiyi qovluğa kopyala
COPY dist /usr/share/nginx/html

# Portu aç
EXPOSE 80

# Nginx-i foreground-da işə sal
CMD ["nginx", "-g", "daemon off;"]