import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Vault Factory", async function () {
  async function deployContracts() {
    const { owner } = await getSigners();
    const VaultFactory = await ethers.getContractFactory("VaultFactory");
    const NFTCollection = await ethers.getContractFactory("NFTCollection");

    const vaultFactory = await VaultFactory.deploy();
    const nftCollection = await NFTCollection.deploy();

    await vaultFactory.waitForDeployment();
    await nftCollection.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { vaultFactory, nftCollection };
  }

  async function getSigners() {
    const [deployer, owner] = await ethers.getSigners();
    return { deployer, owner };
  }

  it("Should be create NFT Vault Success", async () => {
    const firstSupply = 1_000_000_000;
    const firstPrice = 1000;
    const { owner } = await getSigners();

    const { vaultFactory, nftCollection } = await loadFixture(deployContracts);

    const tokenId = await nftCollection.nextTokenId();

    // Mint nft
    await nftCollection.mint(owner.address, "https://link/1");
    await nftCollection.connect(owner).approve(vaultFactory.target, tokenId);

    const vaultAddress = await vaultFactory.getVault(nftCollection.target, tokenId, firstSupply, firstPrice);
    const createVaultTx = await vaultFactory.connect(owner).createVault(nftCollection.target, tokenId, firstSupply, firstPrice);
    await createVaultTx.wait();

    const vaultCount = await vaultFactory.vaultCount();
    const expectAddress = await vaultFactory.vaults(vaultCount);
    expect(vaultAddress).to.eq(expectAddress);


    const nftVault = await ethers.getContractAt("NFTVault", vaultAddress);

    // Check owner of
    const currentOwnerOf = await nftCollection.ownerOf(tokenId);
    expect(nftVault.target.toString()).to.eq(currentOwnerOf);


    // Check mint to owner
    const fractionBalanceOfOwner = await nftVault.balanceOf(owner.address);
    const totalSupplyOfFraction = await nftVault.totalSupply();
    expect(firstSupply).to.eq(fractionBalanceOfOwner);
    expect(firstSupply).to.eq(totalSupplyOfFraction);
  });
});