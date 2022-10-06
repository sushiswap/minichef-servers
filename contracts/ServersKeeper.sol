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

    uint256 public minTimePeriod;

    address[] internal servers;
    mapping(address => uint256) public lastHarvestAndBridge;

    constructor(address _masterchef, uint256 _minTimePeriod) {
        masterchef = IMasterChef(_masterchef);
        minTimePeriod = _minTimePeriod;
    }

    ///@notice Set the array of servers to be checked by the keeper
    function setServers(address[] calldata _servers) external onlyOwner {
        for (uint256 i = 0; i < _servers.length; ) {
            lastHarvestAndBridge[_servers[i]] = block.timestamp;

            unchecked {
                i += 1;
            }
        }
        servers = _servers;
    }

    function setMinTimePeriod(uint256 newMinTimePeriod) external onlyOwner {
        minTimePeriod = newMinTimePeriod;
    }

    ///@notice View function checked by the keeper on every block
    function checkUpkeep(bytes calldata checkData)
        external
        view
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 length = servers.length;
        for (uint256 i = 0; i < length; i++) {
            address server = servers[i];
            if (
                lastHarvestAndBridge[server] + minTimePeriod <
                block.timestamp &&
                masterchef.pendingSushi(BaseServer(server).pid(), server) > 0
            ) {
                return (true, abi.encode(server));
            }
        }
    }

    ///@notice Function executed by the keeper if checkUpKeep returns true
    function performUpkeep(bytes calldata performData) external {
        address server = abi.decode(performData, (address));
        if (
            lastHarvestAndBridge[server] + minTimePeriod < block.timestamp &&
            masterchef.pendingSushi(BaseServer(server).pid(), server) > 0
        ) {
            BaseServer(server).harvestAndBridge();
            lastHarvestAndBridge[server] = block.timestamp;
        }
    }

    ///@notice Servers array getter
    function getServers() external view returns (address[] memory) {
        return servers;
    }
}
