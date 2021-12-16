import { getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();

  const { address } = await deploy("xDaiDummyToken", {
    contract: "DummyToken",
    from: dev,
    args: ["xDai Dummy Token", "XDAIDUMMYTOKEN"],
  });

  console.log(`Deployed xDai Dummy Token at ${address}`);
};

module.exports.tags = ["xDaiDummyToken"];
