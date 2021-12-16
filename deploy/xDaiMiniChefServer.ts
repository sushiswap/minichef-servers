import { ChainId, MINICHEF_ADDRESS } from "@sushiswap/sdk";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const PID = 344;

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();

  const { address } = await deploy("xDaiServer", {
    from: dev,
    args: [PID, MINICHEF_ADDRESS[ChainId.XDAI]],
  });

  console.log(`Deployed xDai MiniChef Server at ${address}`);
};

module.exports.tags = ["xDaiMiniChefServer"];
