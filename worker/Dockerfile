FROM node:11-alpine

RUN mkdir -p /slcApps/src/worker

WORKDIR /slcApps/src/worker
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]