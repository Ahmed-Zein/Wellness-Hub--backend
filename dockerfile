FROM node:alpine

WORKDIR /user/src/app

COPY package.json  .
COPY package-lock.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]