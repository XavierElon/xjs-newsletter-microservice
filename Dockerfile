FROM --platform=linux/amd64 node:16

# Create app directory
WORKDIR /app

RUN apt-get -y update && apt-get -y install

COPY package*.json ./
RUN yarn install

COPY . .
EXPOSE 420

RUN npm install pm2@latest -g
RUN npm run build

CMD ["pm2-runtime", "start", "npm", "--name", "newsletter-microservice", "--", "start", "--watch"]