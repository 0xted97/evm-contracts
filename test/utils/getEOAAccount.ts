import { ethers } from "hardhat";

export async function getEOAAccounts() {
    const [deployer, owner, wallet1] = await ethers.getSigners();
    return { deployer, owner, wallet1 };
  }