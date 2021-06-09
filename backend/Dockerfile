FROM node:15

USER node

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3001/tcp

CMD [ "node", "index.js" ]
