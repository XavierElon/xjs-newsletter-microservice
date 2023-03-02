FROM node:16

# Create app directory
WORKDIR /usr/src/app

RUN --mount=type=cache,target=/var/cache/apt apt-get -y update && apt-get -y install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

COPY package*.json ./
RUN --mount=type=cache,target=/var/cache/yarn yarn config set cache-folder /var/cache/yarn && yarn install

COPY . .
RUN ls 
EXPOSE 420
CMD ["yarn", "run", "dev"]
#RUN npm ci --only=production