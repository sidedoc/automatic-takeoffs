# The Idea - Automatic Takeoffs
This is a MVP for a web app designed to automatically complete construction drawing takeoffs.

Completing a takeoff is normally a manual process where you count, by hand, the number of symbols on the construction drawing. This process is repeated for the hundreds of contruction drawings in each project.

I attempted to automate this task.

# How it works - Architecture
A react.js frontend enables a image to be uploaded and a crop to be taken.
This gets sent via an api to a express backend.
The backend runs the core functionality of the app and uses a computer vision technique called template matching from OpenCV.
This app is then deployed via docker.


The web app can be viewed here: https://automatic-takeoffs.up.railway.app/


# Dockerise for Production or Run Locally
In Dev both the Client and Server Terminals need Node v14 to run (use NVM)

To run locally set up file structure as below. Put all files from repo into server-app folder except for client-app.
![image](https://user-images.githubusercontent.com/64473926/231519371-7fa41b66-ade7-4b77-8bac-874f206bd81f.png)

Production Deploy

- [ ] Build react app and copy build folder into server folder.
- [ ] Ensure templateMatching.js points to the correct opencv4node location.
- [ ] Ensure server.js points to the ‘build’ folder.
- [ ] Remove reference to OpenCV in package.json - change package.json from Dev to Build.
- [ ] Build docker image: docker build -t app-name.
- [ ] \*\* Use the test file to run opencv docker containers to allow ability to command line into it and see where opencv4node is installed.

Development

- [ ] Ensure templateMatching.js points to the correct opencv4node location.
- [ ] Comment out the server.js code that points to the build folder.
- [ ] Include reference to OpenCV in package.json - change packge.json from Build to Dev.
- [ ] Run npm start in client folder and node server in server folder.
