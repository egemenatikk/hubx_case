FROM node:18.11-alpine3.15
WORKDIR /app
RUN npm install pm2 -g
COPY ./package.json .
RUN npm i
EXPOSE 3000
ENV PORT=3000
COPY . .
CMD [ "pm2-runtime", "npm", "--", "start" ]