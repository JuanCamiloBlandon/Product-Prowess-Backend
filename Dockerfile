FROM node:20.17.0-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

##COPY .env ./

EXPOSE 3000

CMD ["npm", "start"]
