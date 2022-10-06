import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();
  const { address } = await deploy("ServersKeeper", {
    contract: "ServersKeeper",
    from: dev,
    args: ["0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd", "1000000000000000000000"],
  });
  console.log(`Deployed Servers Keeper at ${address}`);
};

module.exports.tags = ["Serverskeeper"];

