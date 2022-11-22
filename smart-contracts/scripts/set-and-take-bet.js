const { ethers } = require("hardhat");

async function setAndTakeBet() {
  const betHandler = await ethers.getContract("OO_BetHandler");
  console.log("Setting Bet...");
  const setBetTx = await betHandler.setBet(
    "Will Bitcoin hit 1M by 2025?",
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    0,
    30,
    false,
    "0x0000000000000000000000000000000000000000",
    true,
    "10000",
    "10000");
  const setBetTxReceipt = await setBetTx.wait(1);
  const betCreator = setBetTxReceipt.events[0].args.creator;
  console.log(betCreator);
}

setAndTakeBet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })