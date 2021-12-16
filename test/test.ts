import hre, { ethers } from "hardhat";
import { expect } from "chai";

type Contract = typeof ethers.Contract.prototype;

import MASTERCHEF_V2_ABI from "./abis/MasterChefV2.json";
import { ChainId, MINICHEF_ADDRESS } from "@sushiswap/sdk";
const MASTERCHEF_V2 = "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d";

declare module "mocha" {
  export interface Context {
    DummyToken: Contract;
    MasterchefV2: Contract;
    Server: Contract;
    pid: number;
  }
}

describe("Servers", function () {
  beforeEach("", async function () {
    this.MasterchefV2 = await ethers.getContractAt(
      MASTERCHEF_V2_ABI,
      MASTERCHEF_V2
    );
    const [ownerAddress] = await this.MasterchefV2.functions.owner();
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ownerAddress],
    });
    const ownerSigner = ethers.provider.getSigner(ownerAddress);
    this.DummyToken = (await (await ethers.getContractFactory("DummyToken"))
      .connect(ownerSigner)
      .deploy("Dummy", "DUM")) as any as Contract;
    this.MasterchefV2 = this.MasterchefV2.connect(ownerSigner);
    this.pid = Number(
      (
        await (
          await this.MasterchefV2.functions.add(
            20,
            this.DummyToken.address,
            ethers.constants.AddressZero,
            { gasLimit: 1000000 }
          )
        ).wait()
      ).logs[0].topics[1]
    );
  });

  describe("PolygonServer", async function () {
    beforeEach("", async function () {
      this.Server = await (
        await ethers.getContractFactory("PolygonServer")
      ).deploy(this.pid, MINICHEF_ADDRESS[ChainId.MATIC]);
      await this.DummyToken.functions.approve(this.MasterchefV2.address, 1, {
        gasLimit: 1000000,
      });
      await this.MasterchefV2.functions.deposit(
        this.pid,
        1,
        this.Server.address,
        { gasLimit: 5000000 }
      );
      await hre.network.provider.request({
        method: "evm_mine",
      });
    });

    it("Harvests and bridges", async function () {
      const logs = (await (await this.Server.functions.harvest()).wait()).logs;
      const polygonErcBridge = (
        await this.Server.functions.polygonErcBridge()
      )[0];
      const depositLog = logs.find(
        (log: any) => log.address === polygonErcBridge
      );

      expect(
        depositLog.topics[2].includes(
          MINICHEF_ADDRESS[ChainId.MATIC].substring(2).toLowerCase()
        )
      ).to.be.true;
      expect(Number(depositLog.data) > 0).to.be.true;
    });
  });

  describe("xDaiServer", async function () {
    beforeEach("", async function () {
      this.Server = await (
        await ethers.getContractFactory("xDaiServer")
      ).deploy(this.pid, MINICHEF_ADDRESS[ChainId.XDAI]);
      await this.DummyToken.functions.approve(this.MasterchefV2.address, 1, {
        gasLimit: 1000000,
      });
      await this.MasterchefV2.functions.deposit(
        this.pid,
        1,
        this.Server.address,
        { gasLimit: 5000000 }
      );
      await hre.network.provider.request({
        method: "evm_mine",
      });
    });

    it("Harvests and bridges", async function () {
      const logs = (await (await this.Server.functions.harvest()).wait()).logs;
      const bridge = (await this.Server.functions.bridgeAddr())[0];
      const depositLog = logs.find((log: any) => log.address === bridge);

      // Unfortunately the event doesn't include the receiver...
      expect(Number(depositLog.data) > 0).to.be.true;
    });
  });

  describe("HarmonyServer", async function () {
    beforeEach("", async function () {
      this.Server = await (
        await ethers.getContractFactory("HarmonyServer")
      ).deploy(this.pid, MINICHEF_ADDRESS[ChainId.HARMONY]);
      await this.DummyToken.functions.approve(this.MasterchefV2.address, 1, {
        gasLimit: 1000000,
      });
      await this.MasterchefV2.functions.deposit(
        this.pid,
        1,
        this.Server.address,
        { gasLimit: 5000000 }
      );
      await hre.network.provider.request({
        method: "evm_mine",
      });
    });

    it("Harvests and bridges", async function () {
      const logs = (await (await this.Server.functions.harvest()).wait()).logs;
      const bridge = (await this.Server.functions.bridgeAddr())[0];
      const depositLog = logs.find((log: any) => log.address === bridge);

      expect(
        depositLog.data
          .substring(66)
          .includes(
            MINICHEF_ADDRESS[ChainId.HARMONY].substring(2).toLowerCase()
          )
      ).to.be.true;
      expect(Number(depositLog.data.substring(0, 66)) > 0).to.be.true;
    });
  });

  describe("CeloServer", async function () {
    beforeEach("", async function () {
      this.Server = await (
        await ethers.getContractFactory("CeloServer")
      ).deploy(this.pid, MINICHEF_ADDRESS[ChainId.CELO]);
      await this.DummyToken.functions.approve(this.MasterchefV2.address, 1, {
        gasLimit: 1000000,
      });
      await this.MasterchefV2.functions.deposit(
        this.pid,
        1,
        this.Server.address,
        { gasLimit: 5000000 }
      );
      await hre.network.provider.request({
        method: "evm_mine",
      });
    });

    it("Harvests and bridges", async function () {
      const logs = (await (await this.Server.functions.harvest()).wait()).logs;
      const bridge = (await this.Server.functions.bridgeAddr())[0];
      const depositLog = logs.find((log: any) => log.address === bridge);

      expect(
        depositLog.data
          .substring(0, 66)
          .includes(MINICHEF_ADDRESS[ChainId.CELO].substring(2).toLowerCase())
      ).to.be.true;
      expect(Number("0x" + depositLog.data.substring(66)) > 0).to.be.true;
    });
  });

  // Moonriver bridging is just simple ERC20 transfers to an EOA...
  // describe("AnyswapServer", async function () {
  //   beforeEach("", async function () {
  //     this.Server = await (
  //       await ethers.getContractFactory("AnyswapServer")
  //     ).deploy(
  //       this.pid,
  //       MINICHEF_ADDRESS[ChainId.MOONRIVER],
  //       ChainId.MOONRIVER
  //     );
  //     await this.DummyToken.functions.approve(this.MasterchefV2.address, 1, {
  //       gasLimit: 1000000,
  //     });
  //     await this.MasterchefV2.functions.deposit(
  //       this.pid,
  //       1,
  //       this.Server.address,
  //       { gasLimit: 5000000 }
  //     );
  //     await hre.network.provider.request({
  //       method: "evm_mine",
  //     });
  //   });

  //   it("Harvests and bridges", async function () {
  //     const logs = (await (await this.Server.functions.harvest()).wait()).logs;
  //     const bridge = (await this.Server.functions.bridgeAddr())[0];
  //     const chainId = await this.Server.functions.chainId();
  //     const depositLog = logs.find((log: any) => log.address === bridge);

  //     expect(
  //       depositLog.data
  //         .substring(66)
  //         .includes(
  //           MINICHEF_ADDRESS[ChainId.MOONRIVER].substring(2).toLowerCase()
  //         )
  //     ).to.be.true;
  //     expect(Number(depositLog.data.substring(0, 66)) > 0).to.be.true;
  //   });
  // });
});
