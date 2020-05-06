const request = require('request');
const fs = require('fs');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const url = process.argv[2];
const localFile = process.argv[3];


request(url, (error1, response) => {
  if (error1) throw error1;

  if (response.statusCode !== 200) {
    console.log("Error: non-200 status code\n");
    process.exit();
  }

  if (!localFile) {
    console.log("Error: invalid local file path... please try again\n");
    process.exit();
  }

  if (fs.existsSync(localFile)) {
    rl.question("Caution: file already exists... enter 'Y' to overwrite, or enter any other key to exit\n", entry => {
      if (entry === "Y") {
        fs.writeFile(localFile, response.body, error2 => {
          if (error2) throw error2;
      
          const stats = fs.statSync(localFile);
          const fileSize = stats.size;
      
          console.log(`Downloaded and saved ${fileSize} bytes to ${localFile}\n`);
          rl.close();
        });
      } else {
        rl.close();
      }
    });
  } else {
    fs.writeFile(localFile, response.body, error2 => {
      if (error2) throw error2;
  
      const stats = fs.statSync(localFile);
      const fileSize = stats.size;
  
      console.log(`Downloaded and saved ${fileSize} bytes to ${localFile}\n`);
      process.exit();
    });
  }

});