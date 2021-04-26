import { ethers } from "hardhat";
import { mumbaiConfig, rinkebyConfig, kovanConfig } from "./config"

const fundContract = {
    value: ethers.utils.parseEther("2")
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with ${deployer.address}`);

    const balance = await deployer.getBalance()
    console.log(`Account balance: ${balance.toString()}`);

    const Coinflip = await ethers.getContractFactory("Coinflip");
    const coinflip = await Coinflip.deploy(...rinkebyConfig, fundContract);
    console.log(`Coinflip address: ${coinflip.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })