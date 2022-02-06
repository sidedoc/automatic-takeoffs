FROM vinhtranvan/opencv4nodejs-alpine

WORKDIR /usr/local/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5001

EXPOSE 5001

CMD [ "node", "server.js"]