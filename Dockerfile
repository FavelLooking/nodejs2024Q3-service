
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production --force && npm cache clean --force
RUN npm install -g @nestjs/cli  --force && npm cache clean --force

COPY . .
COPY .env .env

RUN npx prisma generate

EXPOSE ${PORT}

CMD ["npm", "start"]