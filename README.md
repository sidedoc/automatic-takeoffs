# The Idea - Automatic Takeoffs
This is a MVP for a web app designed to automatically complete construction drawing takeoffs.

Completing a takeoff is normally a manual process where someone counts the number of symbols on the construction drawing. This process is repeated for the hundreds of contruction drawings in each project.

I attempted to automate this task.

# How it works - Architecture
A react.js frontend enables a image to be uploaded and a crop to be taken which gets sent to a express backend. 
This backend runs the core functionality of the app, OpenCV's 'template matching' computer vision approach.
This app is then deployed via docker.


The web app can be viewed here: https://automatic-takeoffs.up.railway.app/


# Upload to Heroku or Run Locally
OpenCV needs Node Version 14 to run.
In Dev both the Client and Sever Terminals need Node v14 to run (use NVM)

Production Deploy

- [ ] Build react app and copy build folder into server folder
- [ ] Ensure templateMatching.js points to the correct opencv4node location.
- [ ] Ensure server.js points to the ‘build’ folder.
- [ ] Remove reference to OpenCV in package.json - change package.json from Dev to Build.
- [ ] Build docker image: docker build -t app-name .
- [ ] \*\* Use the test file to run opencv docker containers to allow ability to command line into it and see where opencv4node is installed.

Development

- [ ] Ensure templateMatching.js points to the correct opencv4node location.
- [ ] Comment out the server.js code that points to the build folder.
- [ ] Include reference to OpenCV in package.json - change packge.json from Build to Dev.
- [ ] Run npm start in client folder and node server in server folder.
