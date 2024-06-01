const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", () => {
  let SimpleStorageFactory, simpleStorage
  beforeEach(async () => {
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await SimpleStorageFactory.deploy()
  })

  it("Should start with a favorite of 0", async () => {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0"
    // Assert or Expect
    assert.equal(currentValue.toString(), expectedValue)
    // expect(currentValue.toString()).to.equal(expectedValue)
  })
  it("Should update when we call store", async () => {
    const expectedValue = "2"
    const transactionResponse = await simpleStorage.store(expectedValue)
    transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })
})