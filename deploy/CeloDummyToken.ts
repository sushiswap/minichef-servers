import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();
  const { address } = await deploy("CeloDummyToken", {
    contract: "DummyToken",
    from: dev,
    args: ["Celo Dummy Token", "CELODUMMYTOKEN"],
  });
  console.log(`Deployed Celo Dummy Token at ${address}`);
};

module.exports.tags = ["CeloDummyToken"];
