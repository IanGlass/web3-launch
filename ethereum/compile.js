const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

// First remove everything from the contract build output directory
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

const contracts = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in contracts) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + '.json'),
    contracts[contract]
  );
}