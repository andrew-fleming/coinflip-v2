import { ethers } from "hardhat";
import { BigNumber } from "ethers"

type DeployParams = Array<string | BigNumber>

// Kovan Network
export const kovanConfig: DeployParams = [
    "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", // coorAddr
    "0xa36085F69e2889c224210F603D836748e7dC0088", //linkAddr
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4", // keyHash
    ethers.utils.parseEther(".1") // fee
]

// Rinkeby Network
export const rinkebyConfig: DeployParams = [
    "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B", // coorAddr
    "0x01be23585060835e02b77ef475b0cc51aa1e0709", // linkAddr
    "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311", //keyHash
    ethers.utils.parseEther(".1") // fee
]

// Mumbai Network
export const mumbaiConfig: DeployParams = [
    "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255", // coorAddr
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", // linkAddr
    "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4", // keyHash
    ethers.utils.parseEther("0.0001"), // fee
]
