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
  it("Should get the last added person", async ()=> {
    const currentValue = await simpleStorage.getNewPerson()
    const expectValue = "0,";
    expect(currentValue.toString()).to.equal(expectValue)
  })
  it("Should add new Person with favorit number", async ()=> {
    const expectedName = "John"
    const expectedNum = "4"
    const expectedValue = `${expectedNum},${expectedName}`
    const transactionResponse = await simpleStorage.addPerson(expectedName, expectedNum)
    transactionResponse.wait(3)

    const currentValue = await simpleStorage.getNewPerson()
    expect(currentValue.toString()).to.equal(expectedValue)
  })
})