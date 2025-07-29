# Usar la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo
RUN mkdir -p /home/app

WORKDIR /home/app

# Copiar los archivos de dependencias
COPY package*.json ./

RUN npm install

COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"] 