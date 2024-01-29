import { expect } from "chai";
import { ethers } from "hardhat";
import { HandleTokenURI, TaoWHandles } from "../../../typechain-types";
import { getEOAAccounts } from "../../utils/getEOAAccount";

describe("TaoWHandles", function () {
  let taowHandes: TaoWHandles;
  let handleTokenURI: HandleTokenURI;
  before(async () => {
    // Deploy libs
    const GintoNordFontSVG = await ethers.getContractFactory('GintoNordFontSVG');
    const gintoNordFontSVG = await GintoNordFontSVG.deploy();

    const HandleSVG = await ethers.getContractFactory('HandleSVG', {
      libraries: {
        GintoNordFontSVG: gintoNordFontSVG.target
      }
    });
    const handleSVG = await HandleSVG.deploy();

    const HandleTokenURI = await ethers.getContractFactory("HandleTokenURI", {
      libraries: {
        HandleSVG: handleSVG.target
      }
    });

    const { deployer } = await getEOAAccounts();

    const TaoWHandlers = await ethers.getContractFactory("TaoWHandles");
    taowHandes = await TaoWHandlers.deploy(deployer.address);

    expect(await taowHandes.OWNER()).to.be.eq(deployer.address);

    handleTokenURI = await HandleTokenURI.deploy();

    const setHandleTokenURITx = await taowHandes.setHandleTokenURIContract(handleTokenURI.target);
    await setHandleTokenURITx.wait();


    expect(await taowHandes.getHandleTokenURIContract()).to.be.eq(handleTokenURI.target);

  });



  describe("Mint username", () => {
    const validName = "test";
    const invalidName = "Test";
    it("Mint username with valid name", async () => {
      const { wallet1 } = await getEOAAccounts();

      const mintTx = await taowHandes.mintHandle(wallet1.address, validName);
      await mintTx.wait();

      const tokenId = await taowHandes.getTokenId(validName);
      const name = await taowHandes.getLocalName(tokenId);
      const owner = await taowHandes.ownerOf(tokenId);
      const uri = await taowHandes.tokenURI(tokenId);
      console.log("🚀 ~ it ~ uri:", uri)

      expect(name).to.be.eq(validName);
      expect(owner).to.be.eq(wallet1.address);
    });

    it("Mint username with duplicate name", async () => {
      const { wallet1 } = await getEOAAccounts();

      const mintTx = taowHandes.mintHandle(wallet1.address, validName);

      await expect(mintTx).revertedWithCustomError(taowHandes, "ERC721InvalidSender");
    });

    it("Mint username with invalid name", async () => {
      const { wallet1 } = await getEOAAccounts();

      const mintTx = taowHandes.mintHandle(wallet1.address, invalidName);

      await expect(mintTx).revertedWithCustomError(taowHandes, "HandleContainsInvalidCharacters");
    });
  });

});
