const fs = require("fs");
const readline = require("readline");
const shelljs = require("shelljs");

async function getReadLine(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(message, function (value) {
      rl.close();
      resolve(value);
    });
  });
}

async function airdropNFT() {
  const mintListFilePath = await getReadLine(
    "Type mint list file path(json): "
  );
  let rawdataMint = fs.readFileSync(mintListFilePath);
  let mintList = JSON.parse(rawdataMint);

  const holderListFilePath = await getReadLine(
    "Type NFT holder list file path(json): "
  );
  let rawdataHolder = fs.readFileSync(holderListFilePath);
  let holderList = JSON.parse(rawdataHolder);

  for (let i = 0; i < mintList.length; i++) {
    let mintAddress = mintList[i];
    let holderAddress = holderList[i].owner_wallet;
    if (
      !mintAddress ||
      mintAddress == undefined ||
      mintAddress == "" ||
      !holderAddress ||
      holderAddress == undefined ||
      holderAddress == ""
    )
      continue;

    shelljs.exec(
      `spl-token transfer --allow-unfunded-recipient --fund-recipient ${mintAddress} 1 ${holderAddress}`
    );
  }
}

airdropNFT();
