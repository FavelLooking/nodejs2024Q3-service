
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production --force && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]