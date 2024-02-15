import { expect } from "chai";
import { ethers } from "hardhat";
import { Diamond, DiamondInit, OwnershipFacet, DiamondCutFacet, DiamondLoupeFacet, FacetA, FacetA2 } from "../../../typechain-types";
import { getEOAAccounts } from "./../../utils";
import { FacetCutAction } from "./utils";

describe("DiamondProxy", function () {
  let diamond: Diamond; // Proxy
  let diamondInit: DiamondInit; // Calldata Init
  let diamondInOwnershipFacet: OwnershipFacet;
  let diamondInCutFacet: DiamondCutFacet;
  let diamondInLoupeFacet: DiamondLoupeFacet;
  // constants

  before(async () => {
    const { deployer } = await getEOAAccounts();
    const DiamondInit = await ethers.getContractFactory("DiamondInit");
    diamondInit = await DiamondInit.deploy()
    await diamondInit.waitForDeployment();


    const FacetNames = [
      'OwnershipFacet',
      'DiamondCutFacet',
      'DiamondLoupeFacet',
    ];
    const facetCuts = [];
    for (const FacetName of FacetNames) {
      const Facet = await ethers.getContractFactory(FacetName);
      const facet = await Facet.deploy();
      await facet.waitForDeployment();
      console.log(`${FacetName} deployed: ${facet.target}`);

      const selectors: string[] = [];
      facet.interface.forEachFunction((fn) => {
        selectors.push(fn.selector);
      });

      facetCuts.push({
        facetAddress: facet.target,
        action: FacetCutAction.Add,
        functionSelectors: selectors
      });
    }



    let functionCall = diamondInit.interface.encodeFunctionData('init');
    const diamondArgs = {
      owner: deployer.address,
      init: diamondInit.target,
      initCalldata: functionCall
    }


    const Diamond = await ethers.getContractFactory('Diamond');
    diamond = await Diamond.deploy(facetCuts, diamondArgs);
    await diamond.waitForDeployment();

    diamondInOwnershipFacet = await ethers.getContractAt("OwnershipFacet", diamond.target);
    diamondInCutFacet = await ethers.getContractAt("DiamondCutFacet", diamond.target);
    diamondInLoupeFacet = await ethers.getContractAt("DiamondLoupeFacet", diamond.target);



    await Promise.all(facetCuts.map(async (f) => {
      const selectors = await diamondInLoupeFacet.facetFunctionSelectors(f.facetAddress);
      // check match selectors
      // expect(selectors).to.be.eq(f.functionSelectors);

      const facetAddress = await diamondInLoupeFacet.facetAddress(f.functionSelectors[0]);
      // check match selector with facet
      // expect(facetAddress).to.be.eq(f.facetAddress);

    }));



  });



  it("Should transfer ownership successfully", async function () {
    const { deployer, wallet1 } = await getEOAAccounts();

    const currentOwner = await diamondInOwnershipFacet.owner();
    expect(currentOwner).to.be.eq(deployer.address);

    const transferOwnerTx = await diamondInOwnershipFacet.transferOwnership(wallet1.address);
    await transferOwnerTx.wait();

    const nextOwner = await diamondInOwnershipFacet.owner();
    expect(nextOwner).to.be.eq(wallet1.address);

    // Transfer to deployer
    const tx = await diamondInOwnershipFacet.connect(wallet1).transferOwnership(deployer.address);
    await tx.wait();
  });


  describe("Add new Facet", () => {
    let facetA: FacetA;
    let facetA2: FacetA2;
    before(async () => {
      const FacetA = await ethers.getContractFactory("FacetA");
      facetA = await FacetA.deploy();
      await facetA.waitForDeployment();

      const FacetA2 = await ethers.getContractFactory("FacetA2");
      facetA2 = await FacetA2.deploy();
      await facetA2.waitForDeployment();
    });

    it("Should add FacetA successfully", async function () {
      const selectors: string[] = [];
      facetA.interface.forEachFunction((fn) => {
        selectors.push(fn.selector);
      });

      const facetCuts = [];
      facetCuts.push({
        facetAddress: facetA.target,
        action: FacetCutAction.Add,
        functionSelectors: selectors
      });

      const addFaucetTx = await diamondInCutFacet.diamondCut(facetCuts, ethers.ZeroAddress, "0x");
      await addFaucetTx.wait();

      const diamondInFacetA = await ethers.getContractAt("FacetA", diamond.target);

      const expectBytes = ethers.hexlify(ethers.randomBytes(32));
      const setTx = await diamondInFacetA.setDataA(expectBytes);
      await setTx.wait();

      const dataA = await diamondInFacetA.getDataA();
      expect(dataA.toLowerCase()).to.be.eq(expectBytes.toLowerCase());
    });

    it("Should update any functions FacetA to FacetA2 successfully", async function () {
      const selectors: string[] = [];
      facetA.interface.forEachFunction((fn) => {
        selectors.push(fn.selector);
      });

      const facetCuts = [];
      facetCuts.push({
        facetAddress: facetA2.target,
        action: FacetCutAction.Replace,
        functionSelectors: selectors
      });

      const replaceFaucetTx = await diamondInCutFacet.diamondCut(facetCuts, ethers.ZeroAddress, "0x");
      await replaceFaucetTx.wait();

      const diamondInFacetA2 = await ethers.getContractAt("FacetA2", diamond.target);

      const randomBytes = ethers.hexlify(ethers.randomBytes(32));
      const expectBytes = ethers.keccak256(randomBytes);
      const setTx = await diamondInFacetA2.setDataA(randomBytes);
      await setTx.wait();

      const dataA = await diamondInFacetA2.getDataA();
      expect(dataA.toLowerCase()).to.be.eq(expectBytes.toLowerCase());
    });


    it("Should remove setDataA(bytes32) functions FacetA2 successfully", async function () {
      const selectors: string[] = [];
      facetA.interface.forEachFunction((fn) => {
        if (fn.name === "setDataA") {
          selectors.push(fn.selector);
        }

      });
      console.log("🚀 ~ selectors:", selectors)

      const facetCuts = [];
      facetCuts.push({
        facetAddress: ethers.ZeroAddress,
        action: FacetCutAction.Remove,
        functionSelectors: selectors
      });

      const removeFaucetTx = await diamondInCutFacet.diamondCut(facetCuts, ethers.ZeroAddress, "0x");
      await removeFaucetTx.wait();

      const diamondInFacetA = await ethers.getContractAt("FacetA2", diamond.target);

      const dataA = await diamondInFacetA.getDataA();
      expect(dataA);

      const randomBytes = ethers.hexlify(ethers.randomBytes(32));
      await expect(diamondInFacetA.setDataA(randomBytes)).revertedWithCustomError({ interface: diamond.interface }, "FunctionNotFound");

    });
  })

});
