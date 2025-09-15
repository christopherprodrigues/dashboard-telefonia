# Build da aplicação React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Servir os arquivos estáticos com Nginx
FROM nginx:stable-alpine
# Copia os arquivos de build do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html
# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]