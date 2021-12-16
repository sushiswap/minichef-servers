import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { dev } = await getNamedAccounts();
  const { address } = await deploy("PolygonDummyToken", {
    contract: "DummyToken",
    from: dev,
    args: ["Polygon Dummy Token", "POLYGONDUMMYTOKEN"],
  });
  console.log(`Deployed Polygon Dummy Token at ${address}`);
};

module.exports.tags = ["PolygonDummyToken"];
