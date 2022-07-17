import { assert } from "chai"
import { ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { FundMe } from "../../typechain-types"

// Don't run when running on development chain
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe: FundMe
          let deployer: string
          const sendValue = ethers.utils.parseEther("0.05")

          this.beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              // Assume contract has been deployed to test net
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
