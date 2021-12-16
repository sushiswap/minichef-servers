import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();
  const { address } = await deploy("ArbitrumDummyToken", {
    contract: "DummyToken",
    from: dev,
    args: ["Arbitrum Dummy Token", "ARBITRUMDUMMYTOKEN"],
  });
  console.log(`Deployed Arbitrum Dummy Token at ${address}`);
};

module.exports.tags = ["ArbitrumDummyToken"];
