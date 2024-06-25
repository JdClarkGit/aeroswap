// Use this library to in order to interact with hardhat + the blockchain
const hre = require("hardhat");
// from aerodrome docs
const routerAddress = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43";

// getting the json abi out of the folder. Once contract compiled, artifacts was created
async function main() {
  const aeroSwap = await hre.ethers.getContractFactory("AeroSwap");
  console.log("AeroSwap is deploying...");

  const myContract = await aeroSwap.deploy(routerAddress);

  const tx = await myContract.waitForDeployment();
  console.log(
    `BasicSwap deployed to: ${await myContract.getAddress()} on ${
      hre.network.name
    }\n`
  );

  console.log(tx);
}

main();
