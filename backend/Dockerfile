FROM node:15.8.0-alpine3.13

ENV NODE_ENV=production

WORKDIR /app
COPY ["package.json", "package-lock.json", "."]
RUN npm ci --only=production

COPY . .

EXPOSE 3001/tcp

RUN chown -R 999 /app
USER 999

CMD [ "node", "index.js" ]
