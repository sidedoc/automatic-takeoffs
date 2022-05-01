OpenCV needs Node Version 14 to run.
In Dev both the CLient and Sever Terminals need Node v14 to run (use NVM)

Production Deploy

- [ ] Build react app and copy build folder into server folder
- [ ] Ensure templateMatching.js points to the correct opencv4node location.
- [ ] Ensure server.js points to the ‘build’ folder.
- [ ] Remove reference to OpenCV in package.json - change packge.json from Dev to Build.
- [ ] Build docker image: docker build -t app-name .
- [ ] Go through heroku CLI procedure above. (https://www.youtube.com/watch?v=tTwGdUTR5h8&ab_channel=SyndriTraining)
- [ ] \*\* Use the test file to run opencv docker containers to allow ability to command line into it and see where opencv4node is installed.

Development

- [ ] Ensure templateMatching.js points to the correct opencv4node location.
- [ ] Comment out the server.js code that points to the build folder.
- [ ] Include reference to OpenCV in package.json - change packge.json from Build to Dev.
- [ ] Run npm start in client folder and node server in server folder.
