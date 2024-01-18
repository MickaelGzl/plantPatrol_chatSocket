FROM node:20.11.0-alpine3.19

WORKDIR /chat

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3002

# ENV PATH=$PATH:/app/node_modules/.bin

CMD ["npm", "run", "dev"]