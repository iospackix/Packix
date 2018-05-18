FROM node:9.6.1

ARG is_building
ENV DOCKER_BUILDING=$is_building

RUN mkdir -p /app
WORKDIR /app

# Copy dependency definitions
COPY . .

EXPOSE 8080
EXPOSE 8081
CMD [ "npm", "start" ]
