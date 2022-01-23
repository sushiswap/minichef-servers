import { ChainId, MINICHEF_ADDRESS } from "@sushiswap/sdk";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const PID = 345;

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();

  const { address } = await deploy("CeloServer", {
    from: dev,
    args: [PID, MINICHEF_ADDRESS[ChainId.CELO]],
  });

  console.log(`Deployed Celo MiniChef Server at ${address}`);
};

module.exports.tags = ["CeloMiniChefServer"];
