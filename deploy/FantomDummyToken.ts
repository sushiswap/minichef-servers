import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();

  const { address } = await deploy("FantomDummyToken", {
    contract: "DummyToken",
    from: dev,
    args: ["Fantom Dummy Token", "FANTOMDUMMYTOKEN"],
  });

  console.log(`Fantom xDai Dummy Token at ${address}`);
};

module.exports.tags = ["FantomDummyToken"];
