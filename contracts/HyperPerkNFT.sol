// SPDX-License-Identifier: MIT
/*
 __  __                                     ____               __         
/\ \/\ \                                   /\  _`\            /\ \        
\ \ \_\ \  __  __  _____      __   _ __    \ \ \L\ \ __   _ __\ \ \/'\    
 \ \  _  \/\ \/\ \/\ '__`\  /'__`\/\`'__\   \ \ ,__/'__`\/\`'__\ \ , <    
  \ \ \ \ \ \ \_\ \ \ \L\ \/\  __/\ \ \/     \ \ \/\  __/\ \ \/ \ \ \\`\  
   \ \_\ \_\/`____ \ \ ,__/\ \____\\ \_\      \ \_\ \____\\ \_\  \ \_\ \_\
    \/_/\/_/`/___/> \ \ \/  \/____/ \/_/       \/_/\/____/ \/_/   \/_/\/_/
               /\___/\ \_\  https://www.hyperperk.com                                        
               \/__/  \/_/ 

--------------------
ERC-20 Primary Token
--------------------

paul@conductiveresearch.com

*/
pragma solidity ^0.8.0;

interface NFT {
    function mint(address _to, uint256 _id, uint256 _quantity, bytes calldata _data) external;
    function totalSupply(uint256 _id) external view returns (uint256);
    function maxSupply(uint256 _id) external view returns (uint256);
}