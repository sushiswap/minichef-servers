import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();
  const { address } = await deploy("HarmonyDummyToken", {
    contract: "DummyToken",
    from: dev,
    args: ["Harmony Dummy Token", "HARMONYDUMMYTOKEN"],
  });
  console.log(`Deployed Harmony Dummy Token at ${address}`);
};

module.exports.tags = ["HarmonyDummyToken"];
