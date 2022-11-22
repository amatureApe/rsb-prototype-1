const { asset, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name) ? describe.skip : describe("OO_BetHandler Test", function () {
  let betHandler, deployer, bettor;
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    const accounts = await ethers.getSigners();
    bettor = accounts[1]
    await deployments.fixture(["all"]);
    betHandler = await ethers.getContract("OO_BetHandler");
    weth = await ethers.getContract("IERC20");
    await weth.approve(betHandler.address, "10000");
  });

  it("opens a public bet for other bettors to take", async function () {
    await betHandler.setBet(
      "Will Bitcoin hit 1M by 2025?",
      "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      0,
      30,
      false,
      "0x0000000000000000000000000000000000000000",
      true,
      "10000",
      "10000"
    );
    const bettorConnectedBetHandler = betHandler.connect(bettor);
    await bettorConnectedBetHandler.takeBet(0);
    const newBet = await betHandler.bets(0);
    assert(newBet);
  });
});