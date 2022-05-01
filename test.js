// File used when building a docker container. It allows the dockerfile to run on a loop so you can
// Command Line into the file and see where files are located.

function fun() {
  console.log('Hello World');
}

setInterval(fun, 5000);
