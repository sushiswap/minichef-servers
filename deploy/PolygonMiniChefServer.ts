import { ChainId, MINICHEF_ADDRESS } from "@sushiswap/sdk";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const PID = 344;

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();

  const { address } = await deploy("PolygonServer", {
    from: dev,
    args: [PID, MINICHEF_ADDRESS[ChainId.MATIC]],
  });

  console.log(`Deployed Polygon MiniChef Server at ${address}`);
};

module.exports.tags = ["PolygonMiniChefServer"];
