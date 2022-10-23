FROM node:lts-alpine

RUN mkdir -p /slcApps/src/worker

WORKDIR /slcApps/src/worker

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    chromium \
    harfbuzz \
    "freetype>2.8" \
    ttf-freefont \
    nss
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]