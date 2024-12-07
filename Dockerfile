FROM node:14

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    python3 \
    libopencv-dev

# Set environment variables
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"
ENV LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"

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
