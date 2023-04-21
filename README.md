# Automatic Takeoffs

This is the MVP code for a web app that can automatically count any symbol in an image. A computer vision technique called template matching is used.

# Use Case

Throughout the construction industry, PDF drawings are the go-to method for displaying information about the project. These drawings show the type and locations of items the contractor must install under their scope of work. During the tender stage and throughout the lifecycle of the project, quantities are counted from the drawings in what are called material takeoffs. Currently, this is a manual process whereby items are counted one by one, with the quantities being transferred to an Excel spreadsheet. This can be a massively time-consuming process and also introduces human error when performing takeoffs on hundreds of drawings.

My solution attempts to automate this process using a computer vision technique known as template matching.

The web app can be viewed here: https://automatic-takeoffs.up.railway.app/

A demo video can be viewed here: [https://youtu.be/sEZFV8aP4tY](https://youtu.be/sEZFV8aP4tY)

# How it works

- A react.js frontend enables a image to be uploaded and a crop to be taken.
- This gets sent via an api to a express backend.
- The backend runs the core functionality of the app and uses a computer vision technique called template matching from OpenCV.
- This app is then deployed via docker.

# How to run

### Running Locally

To run locally ensure you are using **Node Version 14** and simply run `npm install` to install the dependancies followed by `npm start` to run the app.

### Creating a Docker Image

To get around any difficulties installing `opnecv4nodejs` a docker image with the package already installed on it can be used.

To build the docker image simply run `docker build -t automatic-takeoffs . `
Running `docker run -p 5001:5001 automatic-takeoffs` will startup a container with the app available at `http://localhost:5001/`

If the developming th eapp further using the docker method run `npm run build` before building the new docker image. This builds the react frontend and reduces the bundle size.
