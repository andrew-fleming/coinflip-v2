import { ethers } from "hardhat";
import { assert, expect } from "chai"
import { MockProvider } from "ethereum-waffle"
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { kovanConfig, mumbaiConfig, rinkebyConfig } from "../scripts/config"

describe("Coinflip Contract", () => {
    let res: any;
    let config: object;
    let instance: Contract;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    //const provider = new MockProvider({
    //    ganacheOptions: {
    //        hardfork: 'istanbul',
    //        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
    //        gasLimit: 9999999
    //    }
    //})
    //const [wallet, other] = provider.getWallets()

    before(async() => {
        const Coinflip = await ethers.getContractFactory("Coinflip");
        [alice, bob] = await ethers.getSigners();

        const fundContract = {
            value: ethers.utils.parseEther("2")
        }

        instance = await Coinflip.deploy(...kovanConfig, fundContract);
    })

    describe("check init", async() => {
        it("should return a name", async() => {
            res = await instance.name()
            assert.equal(res, "Coinflip", "Coinflip contract not deployed correctly")
        });

        it("should return correct contract owner", async() => {
            expect(await instance.owner()).to.equal(alice.address)
        })

        it("Should return correct total contract value", async() => {
            expect(await instance.getTotalValue()).to.equal(ethers.utils.parseEther("2"))
        })

        it("Should return correct contract balance", async() => {
            expect(await instance.contractBalance()).to.equal(ethers.utils.parseEther("2"))
        })
    })

    describe("Check balance-altering functions", async() => {
        it("should produce correct playerWinnings values", async() => {

            config = {
                value: ethers.utils.parseEther("1.5")
            }
            expect(await instance.playerWinnings(alice.address)).to.equal(0)
            await instance.addPlayerWinnings(alice.address, config)
            expect(await instance.playerWinnings(alice.address)).to.equal(ethers.utils.parseEther("1.5"))
        })

        it("should withdraw ether from contract", async() => {
            expect(await instance.contractBalance()).to.equal(ethers.utils.parseEther("2"))
            await instance.withdrawContract()
            expect(await instance.contractBalance()).to.equal(0)
        })
    })
})

describe("Redeploy Coinflip Contract", () => {
    let config: object;
    let instance: Contract;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    before(async() => {
        const Coinflip = await ethers.getContractFactory("Coinflip");
        [alice, bob] = await ethers.getSigners();

        const fundContract = {
            value: ethers.utils.parseEther("2")
        }

        instance = await Coinflip.deploy(...kovanConfig, fundContract);
    })

    describe("Events", async() => {
        it("should emit a Withdraw event from winnings", async() => {
            config = {
                value: ethers.utils.parseEther(".5")
            }
            await instance.addPlayerWinnings(alice.address, config)
            expect(await instance.withdrawPlayerWinnings())
                .to.emit(instance, "Withdraw")
                .withArgs(alice.address, ethers.utils.parseEther(".5"))
        })

        it("should emit a Withdraw event from contract", async() => {
            expect(await instance.withdrawContract())
                .to.emit(instance, "Withdraw")
                .withArgs(alice.address, ethers.utils.parseEther("2"))
        })
    })
})
