import { ChainId, MINICHEF_ADDRESS } from "@sushiswap/sdk";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const PID = 349;

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();

  const { address } = await deploy("FantomServer", {
    from: dev,
    args: [PID, MINICHEF_ADDRESS[ChainId.FANTOM]],
  });

  console.log(`Deployed Fantom MiniChef Server at ${address}`);
};

module.exports.tags = ["FantomMiniChefServer"];
