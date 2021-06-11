# Builder image
FROM node:15.8.0-alpine3.13 as builder

# App config args to avoid using the .env file
ARG REACT_APP_LANG
ARG REACT_APP_API_BASEURL
ENV REACT_APP_LANG=$REACT_APP_LANG
ENV REACT_APP_API_BASEURL=$REACT_APP_API_BASEURL

# Load all node dependencies first before adding src
# such that dependencies layer is cached separately
WORKDIR /client
COPY package.json package-lock.json ./
RUN npm ci

# Now add sources and build prod
COPY src src
COPY public public
RUN npm run build

# Move out to /dist
WORKDIR /
RUN mv /client/build /dist
RUN rm -rf /client

# Runner image
FROM nginx:1.17.2-alpine
WORKDIR /usr/local
COPY --from=builder /dist ./
# Replace nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
# Add bash for the sake of debugging, could safely be removed
RUN apk add --no-cache bash
EXPOSE 80/tcp

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

