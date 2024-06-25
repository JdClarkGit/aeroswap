// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./Router.sol";

contract AeroSwap {
    IRouter public immutable router;

    constructor(address _routerAddress){
        router = IRouter(_routerAddress);
    }

    function swapETHForTokens( uint256 _amountOutMin, IRouter.Route[] calldata _routes, address _to)
     external payable returns (uint256[] memory amounts) {
        router.swapExactETHForTokens{value:msg.value}(
            _amountOutMin,
            _routes,
            _to,
            block.timestamp + 360
        );
    }
}

