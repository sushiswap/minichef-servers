import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();
  const { address } = await deploy("MoonriverDummyToken", {
    contract: "DummyToken",
    from: dev,
    args: ["Moonriver Dummy Token", "MOONRIVERDUMMYTOKEN"],
  });
  console.log(`Deployed Moonriver Dummy Token at ${address}`);
};

module.exports.tags = ["MoonriverDummyToken"];
