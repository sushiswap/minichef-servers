import { ChainId, MINICHEF_ADDRESS } from "@sushiswap/sdk";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const PID = 350;

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();

  const { address } = await deploy("ArbitrumServer", {
    from: dev,
    args: [PID, MINICHEF_ADDRESS[ChainId.ARBITRUM]],
  });

  console.log(`Deployed Arbitrum MiniChef Server at ${address}`);
};

module.exports.tags = ["ArbitrumMiniChefServer"];
