FROM node

WORKDIR /user/src/app

COPY . .

RUN npm i

EXPOSE 3000

CMD [ "npm", "start" ]