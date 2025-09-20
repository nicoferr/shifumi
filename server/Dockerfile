FROM node:20-alpine
WORKDIR /app

# Installer dépendances
COPY backend/package*.json ./
RUN npm install

# Copier le code source
COPY backend ./

# Compiler TypeScript
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
