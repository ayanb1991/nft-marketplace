const { expect } = require("chai");
const hre = require("hardhat");

describe("Marketplace", function () {
  it("It should have an initial MTOKEN balance of 1000", async function () {
    // deploy Marketplace contract
    const marketplace = await hre.ethers.deployContract("Marketplace", [], {});

    const [owner] = await hre.ethers.getSigners();
    const tokenType = 1; // token type for MTOKEN
    const initialMtokenToBeMinted = 1000;

    // assert that the value is correct
    expect(await marketplace.balanceOf(owner, tokenType)).to.equal(
      initialMtokenToBeMinted
    );
  });

  it("It should giveaway 1000 MTOKENS once someone registers to the platform", async function () {
    // deploy Marketplace contract
    const marketplace = await hre.ethers.deployContract("Marketplace", [], {});
    const giveawayMtokenCount = 1000;

    const [, newUser] = await hre.ethers.getSigners();
    const tokenType = 1; // token type for MTOKEN

    // register a user to the platform
    await marketplace.registerUser(newUser);

    // assert that the value is correct
    expect(await marketplace.balanceOf(newUser, tokenType)).to.equal(
      giveawayMtokenCount
    );

    // assert the validation when we call register on a alredy registered user
    await expect(marketplace.registerUser(newUser)).to.be.revertedWith(
      "User already registered"
    );
  });

  it("It should revert with error if registered user tries to register again", async function () {
    // deploy Marketplace contract
    const marketplace = await hre.ethers.deployContract("Marketplace", [], {});

    const [, newUser] = await hre.ethers.getSigners();

    // register a user to the platform
    await marketplace.registerUser(newUser);

    // assert the validation when we call register on a alredy registered user
    await expect(marketplace.registerUser(newUser)).to.be.revertedWith(
      "User already registered"
    );
  });
});
