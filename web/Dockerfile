# Builder image
FROM node:15.8.0-alpine3.13 as builder

# Load all node dependencies first before adding src
# such that dependencies layer is cached separately
WORKDIR /client
ADD package.json package-lock.json ./
RUN npm ci

ADD src src
ADD public public
ADD .eslintrc.js jsconfig.json ./
ARG REACT_APP_BACKEND
ENV REACT_APP_BACKEND=$REACT_APP_BACKEND
RUN npm run build

WORKDIR /

RUN mv /client/build /dist

RUN rm -rf /client

# Runner image
FROM nginx:1.17.2-alpine
WORKDIR /usr/local
COPY --from=builder /dist ./
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
RUN apk add --no-cache bash
ARG port
EXPOSE ${port:-12021} 80/tcp
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
