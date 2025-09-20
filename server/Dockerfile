FROM node:20-alpine
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code
COPY . .
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
