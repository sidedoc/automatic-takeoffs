FROM node:14-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake \
    cmake \
    build-base \
    opencv \
    opencv-dev

WORKDIR /usr/local/app

# Copy package files
COPY dockerPackage.json ./
RUN mv ./dockerPackage.json ./package.json

# Install npm dependencies
RUN npm install

# Copy the rest of the application
COPY . .

ENV PORT=5001
EXPOSE 5001

CMD [ "node", "server.js"]
