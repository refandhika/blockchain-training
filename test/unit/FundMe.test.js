const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async () => {

    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.parseEther("1")
    
    beforeEach(async () => {
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })
    
    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.target)
        })
    })

    describe("fund", async () => {
        it("fails if you don't send enough ETH", async () => {
            // await fundMe.fund()
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
            // await expect(fundMe.fund()).to.be.reverted
        })
        it("update the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("add funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders[0]
            assert.equal(funder, deployer.address)
        })
    })

    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH from a single funder", async () => {
            // get start balance
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            // transaction
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice

            // get updated balance
            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance).toString(),
                (endingDeployerBalance + gasCost).toString()
            )
        })
        it("allows us to withdraw with multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for(let i=0;i<6;i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            
            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance).toString(),
                (endingDeployerBalance + gasCost).toString()
            )

            await expect(fundMe.funders(0)).to.be.reverted

            for(i=1;i<6;i++){
                assert.equal(await fundMe.addressToAmountFunded(accounts[i].address), 0)
            }
        })

        it("only allows the owner to withdraw", async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWithCustomError(
                fundMe,
                "FundMe__NotOwner"
            )
        })
    })
})