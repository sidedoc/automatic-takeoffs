# The Idea - Automatic Takeoffs

This is a MVP for a web app designed to automatically complete construction drawing takeoffs.

Completing a takeoff is normally a manual process where you count, by hand, the number of symbols on the construction drawing. This process is repeated for the hundreds of contruction drawings in each project.

I attempted to automate this task.

# Demo Video

View demo video here: [https://youtu.be/sEZFV8aP4tY](https://youtu.be/sEZFV8aP4tY)

# How it works - Architecture

A react.js frontend enables a image to be uploaded and a crop to be taken.
This gets sent via an api to a express backend.
The backend runs the core functionality of the app and uses a computer vision technique called template matching from OpenCV.
This app is then deployed via docker.

The web app can be viewed here: https://automatic-takeoffs.up.railway.app/

# Dockerise for Production or Run Locally

### Running Locally

- [ ] To run please use node version 14
- [ ] Run 'npm start'

For Production Deployment ensure the following changes are made:

- [ ] Build react app and replace the current build folder with the new one.
- [ ] Ensure templateMatching.js points to the correct opencv4node location. (See top of the file).
- [ ] Ensure server.js points to the 'build' folder.
- [ ] Remove reference to OpenCV in package.json. (Change package.json from Dev to Build).
- [ ] Build docker image: docker build -t app-name.
