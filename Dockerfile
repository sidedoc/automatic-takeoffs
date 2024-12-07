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
    wget \
    unzip \
    opencv \
    opencv-dev

# Set environment variables for OpenCV build
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV OPENCV_VERSION=4.5.4
ENV OPENCV_DIR=/usr

WORKDIR /usr/local/app

# Copy package files
COPY dockerPackage.json ./
RUN mv ./dockerPackage.json ./package.json

# Install npm dependencies and build OpenCV
RUN npm install && \
    cd node_modules/@u4/opencv-build && \
    npm run build-opencv

# Copy the rest of the application
COPY . .

ENV PORT=5001
EXPOSE 5001

CMD [ "node", "server.js"]
