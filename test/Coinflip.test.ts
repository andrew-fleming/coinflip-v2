import { ethers } from "hardhat";
import { assert, expect } from "chai"
import { MockProvider } from "ethereum-waffle"
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Coinflip Contract", () => {
    let res: any;
    let res2: any;
    let res3: any;
    let config: object;
    let instance: Contract;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let dave: SignerWithAddress;
    let eve: SignerWithAddress;

    //const provider = new MockProvider({
    //    ganacheOptions: {
    //        hardfork: 'istanbul',
    //        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
    //        gasLimit: 9999999
    //    }
    //})
    //const [wallet, other] = provider.getWallets()

    // KOVAN
    let kCoorAddr: string = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    let kLinkAddr: string = "0xa36085F69e2889c224210F603D836748e7dC0088"
    let kKeyHash: string = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    let kFee: BigNumber = ethers.utils.parseEther(".1")

    before(async() => {
        const Coinflip = await ethers.getContractFactory("Coinflip");
        [alice, bob, carol, dave, eve] = await ethers.getSigners();
        
        config = {
            value: ethers.utils.parseEther("2")
        }

        instance = await Coinflip.deploy(kCoorAddr, kLinkAddr, kKeyHash, kFee, config);
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