// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import {BaseServer} from "./BaseServer.sol";

interface IMasterChef {
    function pendingSushi(uint256 _pid, address _user)
        external
        view
        returns (uint256);
}

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData)
        external
        view
        returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external;
}

contract ServersKeeper is Ownable, KeeperCompatibleInterface {
    IMasterChef internal immutable masterchef;

    uint256 public minSushiAmount;

    address[] internal servers;

    constructor(address _masterchef, uint256 _minSushiAmount) {
        masterchef = IMasterChef(_masterchef);
        minSushiAmount = _minSushiAmount;
    }

    ///@notice Set the array of servers to be checked by the keeper
    function setServers(address[] calldata _servers) external onlyOwner {
        servers = _servers;
    }

    ///@notice Set the minimum sushi amount available to be harvested to execute a harvestAndBridge
    function serMinSushiAmount(uint256 newMinAmount) external onlyOwner {
        minSushiAmount = newMinAmount;
    }

    ///@notice View function checked by the keeper on every block
    function checkUpkeep(bytes calldata checkData)
        external
        view
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 length = servers.length;
        for (uint256 i = 0; i < length; i++) {
            BaseServer server = BaseServer(servers[i]);
            if (
                masterchef.pendingSushi(server.pid(), servers[i]) >
                minSushiAmount
            ) {
                return (true, abi.encode(i));
            }
        }
    }

    ///@notice Function executed by the keeper if checkUpKeep returns true
    function performUpkeep(bytes calldata performData) external {
        uint256 serverId = abi.decode(performData, (uint256));
        BaseServer server = BaseServer(servers[serverId]);
        if (
            masterchef.pendingSushi(server.pid(), servers[serverId]) >
            minSushiAmount
        ) {
            server.harvestAndBridge();
        }
    }

    ///@notice Servers array getter
    function getServers() external view returns (address[] memory) {
        return servers;
    }
}
