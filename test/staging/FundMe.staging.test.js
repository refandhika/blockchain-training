const { getNamedAccounts, ethers, network } = require("hardhat")
const { assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
        let fundMe
        let deployer
        const sendValue = ethers.parseEther("0.05")

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("allow people to fund and withdraw", async () => {
            await fundMe.fund({ value: sendValue })
            await fundMe.withdraw()
            const endingBalance = await ethers.provider.getBalance(fundMe.target)
            assert.equal(endingBalance.toString(), "0")
        })
    }) 