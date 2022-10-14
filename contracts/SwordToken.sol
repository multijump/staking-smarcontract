/**
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

NOTE: use compiler v0.6.12+commit.27d51765
**/
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.2;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/ERC20.sol";

contract SwordToken is ERC20 {
    constructor () public ERC20("Sword Token", "SWORD") {
        //Mint 1mm tokens
        _mint(msg.sender, 10000000 * 10 ** uint(decimals()));
    }
}