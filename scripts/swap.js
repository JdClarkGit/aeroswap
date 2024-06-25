const hre = require("hardhat");
//This variable allows us to transfer, swap tokens and approve
const IERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");
let provider;
const AeroSwapAddress = "0x3aAde2dCD2Df6a8cAc689EE797591b2913658659";
const aeroAddress = "0x940181a94A35A4569E4529A3CDfB74e38FD98631"; // Address of token you want to receive
const daiAddress = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"; // DAI address in this case
// const tokenAddress if you want to use another token and keep it unambigious
const amountIn = hre.ethers.parseUnits("0.001", 18); // Amount of ETH to swap
const isLive = false; // boolean articulating locally being live or running on live chain

const main = async () => {
  if (isLive) {
    console.log("Running on Mainnet...\n");
    provider = new hre.ethers.WebSocketProvider(
      `wss://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`
    );
  } else {
    console.log("Running on Localhost...\n");
    provider = new hre.ethers.WebSocketProvider(`ws://127.0.0.1:8545/`);
  }
  // making a new walllet on a local chain
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log(signer);

  // Get ABI and Contract Instance
  const IAeroSwap = require("../artifacts/contracts/AeroSwap.sol/AeroSwap.json");
  const aeroSwap = new hre.ethers.Contract(
    AeroSwapAddress,
    IAeroSwap.abi,
    provider
  );

  const aeroContract = new hre.ethers.Contract(
    aeroAddress,
    IERC20.abi,
    provider
  );

  let balance = await aeroContract.balanceOf(signer.address);
  console.log(
    `Balance of AERO Before: ${hre.ethers.formatUnits(balance, 18)}\n`
  );

  const amountOutMin = 0;

  const routes = [
    {
      from: "0x4200000000000000000000000000000000000006", // WETH Address on Base
      to: aeroAddress,
      stable: false,
      factory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da", // Aerodrome Factory Address
    },
  ];

  const tx = await aeroSwap
    .connect(signer)
    .swapETHForTokens(amountOutMin, routes, signer.address, {
      value: amountIn,
    });

  //   await tx.wait();
  balance = await aeroContract.balanceOf(signer.address);
  console.log(
    `Balance of AERO After: ${hre.ethers.formatUnits(balance, 18)}\n`
  );
};

main();
