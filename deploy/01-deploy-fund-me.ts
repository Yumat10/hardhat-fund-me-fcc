import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { network } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployFundMe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed
    }

    // Use a mock when using localhost or hardhat network
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    log("Deployed FundMe Contract")

    // Verify contract if not on local network
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }

    log("-------------------------------")
}

export default deployFundMe
deployFundMe.tags = ["all", "fundme"]
