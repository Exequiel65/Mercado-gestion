# Usa la imagen base de Node.js para compilación
FROM node:20 AS build

# Define el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del package.json y package-lock.json para instalar dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente de la aplicación
COPY . .

# Construye la aplicación (si usas TypeScript)
RUN npm run build

# Usa una imagen más liviana para ejecutar la aplicación
FROM node:20

WORKDIR /app

# Copia los archivos de la compilación desde la etapa anterior
COPY --from=build /app ./

# Expone el puerto en el que corre la API
EXPOSE 80

# Comando para ejecutar la API
CMD ["node", "dist/main.js"]
