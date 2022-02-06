const fs = require('fs');
const readline = require("readline");
const shelljs = require('shelljs');

async function getReadLine(message) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
      rl.question(message, function (value) {
        rl.close();
        resolve(value);
      });
    })
}

async function closeTokens() {
  const closeTokensListPath = await getReadLine("Type token list(json): ");
  let rawList = fs.readFileSync(closeTokensListPath);
  let closeTokens = JSON.parse(rawList);

  for (let closeToken of closeTokens) {
    shelljs.exec(`spl-token close ${closeToken}`);
  }
}

closeTokens();
