FROM node:11-alpine

RUN mkdir -p /slcApps/src/api

WORKDIR /slcApps/src/api

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]