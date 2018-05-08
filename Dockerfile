FROM node:7.6-alpine

RUN mkdir -p /final/app

WORKDIR /final/app

COPY . /final/app

RUN npm install

EXPOSE 3333

CMD [ "npm", "start"]