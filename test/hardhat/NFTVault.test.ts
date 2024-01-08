import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTCollection, NFTVault, VaultFactory } from "../../typechain-types";

describe("Vault Factory", function () {

  let vaultFactory: VaultFactory;
  let nftCollection: NFTCollection;

  before(async () => {
    const VaultFactory = await ethers.getContractFactory("VaultFactory");
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    vaultFactory = await VaultFactory.deploy();
    nftCollection = await NFTCollection.deploy();

    await vaultFactory.waitForDeployment();
    await nftCollection.waitForDeployment();
  });

  async function getSigners() {
    const [deployer, owner] = await ethers.getSigners();
    return { deployer, owner };
  }


  describe("Redeem function", () => {
    const firstSupply = 1_000_000_000;
    const firstPrice = 1000;

    let nftVault: NFTVault;
    before(async () => {
      const { owner } = await getSigners();

      const nextTokenId = await nftCollection.nextTokenId();
      const mintNFT = await nftCollection.mint(owner.address, "");
      await mintNFT.wait();
      await nftCollection.connect(owner).approve(vaultFactory.target, nextTokenId);

      const nftVaultAddress = await vaultFactory.getVault(nftCollection.target, nextTokenId, firstSupply, firstPrice)
      const createVault = await vaultFactory.connect(owner).createVault(nftCollection.target, nextTokenId, firstSupply, firstPrice);
      await createVault.wait();
      nftVault = await ethers.getContractAt("NFTVault", nftVaultAddress);


    });

    it("Should be redeemed with balance == totalSupply", async () => {
      const { owner } = await getSigners();
      const redeemTx = await nftVault.connect(owner).redeem();
      const ownerOf = await nftCollection.ownerOf(await nftVault.tokenId());
      expect(ownerOf).to.eq(ownerOf);
      console.log("🚀 ~ file: NFTVault.test.ts:49 ~ it ~ redeemTx:", redeemTx)
    });

    it("Should be redeemed failed", async () => {
      const { owner } = await getSigners();
      const redeemTx = await nftVault.redeem();
      console.log("🚀 ~ file: NFTVault.test.ts:49 ~ it ~ redeemTx:", redeemTx)
    });
  });
});
