const { spawn } = require("child_process");

// Helper function to promisify child_process.spawn
const spawnPromise = (command, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args); 
    child.stdout.on("data", (data) => {
      console.log("stdout: ==>>", Buffer.from(data).toString());
    });

    child.stderr.on("data", (data) => {
      console.log("stderr: ==>>", Buffer.from(data).toString());
    });

    child.on("error", (error) => {
      console.log("error: ==>>", Buffer.from(error).toString());
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Child process exited with code ${code}`);
      }
    });
  });
};

module.exports = { spawnPromise };
