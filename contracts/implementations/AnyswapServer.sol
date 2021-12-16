// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../BaseServer.sol';

interface IAnyswapBridge {
  function anySwapOutUnderlying(address token, address to, uint256 amount, uint256 toChainID) external;
}

contract AnyswapServer is BaseServer {
  address public constant bridgeAddr = 0x6b7a87899490EcE95443e979cA9485CBE7E71522;
  uint256 public immutable chainId;

  constructor(uint256 _pid, address _minichef, uint256 _chainId) BaseServer(_pid, _minichef) {
    chainId = _chainId;
  }

  function bridge() public override {
    uint256 sushiBalance = sushi.balanceOf(address(this));

    sushi.approve(bridgeAddr, sushiBalance);
    IAnyswapBridge(bridgeAddr).anySwapOutUnderlying(address(sushi), minichef, sushiBalance, chainId);
  }
}