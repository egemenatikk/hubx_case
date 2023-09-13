FROM node:18.11-alpine3.15
WORKDIR /app
RUN  npm install pm2 -g
COPY ./package.json .
RUN npm i
EXPOSE 8080 
ENV PORT=8080
COPY . .
ENV LEARNIFY_DOCKER_DB_URI="mongodb://mongo:27017"
CMD [ "pm2-runtime", "npm", "--", "start" ]