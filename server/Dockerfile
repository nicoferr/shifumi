FROM node:20-alpine
WORKDIR /app
# COPY package*.json ./
# RUN npm install
COPY server ./server
EXPOSE 4000

WORKDIR /app/server
CMD ["npm", "start"]
