FROM node:9.6.1-alpine

ARG is_building
ENV DOCKER_BUILDING=$is_building

RUN mkdir -p /app
WORKDIR /app

# Copy dependency definitions
COPY server/ .

EXPOSE 8080
CMD [ "npm", "start" ]
