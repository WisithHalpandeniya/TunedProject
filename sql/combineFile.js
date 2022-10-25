///----------------COMBING FILES TEST
//need to make it so that the syntax is correct and that its combining the files properly
//make it so that the tags are added
const arr = [];
const fs = require('fs');
const path = require('path');

fs.readdir(path.join(process.cwd(), "./files"), (err, fileNames) => {
  if (err) throw console.log(err.message);
  // Loop fileNames array
  //there might be a method that lets you specify the filename..
  //maybe create a filename variable and have the actual filenmes in it?
  //maybe there is a way to add like [ ios:[ json file contents]] into the combine funct.
  fileNames.forEach((filename) => {
    // Read file content
    fs.readFile(
      path.join(process.cwd(), "./files", `${filename}`),
      (err, data) => {
        if (err) throw console.log(err.message);
        // Log file content
        const output = JSON.parse(data);
        arr.push(output);
        fs.writeFileSync(
          path.join(process.cwd(), "./files", `output.json`),
          JSON.stringify(arr),
          (err) => {
            if (err) throw console.log(err.message);
          }
        );
      }
    );
  });
});
///---------------END-COMBING FILES TEST