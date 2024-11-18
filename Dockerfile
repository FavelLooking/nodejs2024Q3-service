
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production --force && \
    npm install --save-dev nodemon --force && \
    npm cache clean --force
COPY . .
COPY .env .env

RUN npx prisma generate

EXPOSE ${PORT}

CMD ["npx", "nodemon", "--watch", "src", "--exec", "npm start"]