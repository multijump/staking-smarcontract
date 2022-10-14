// SPDX-License-Identifier: MIT
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

------------------------------------
ERC-721 Contract Opensea Integration
------------------------------------                               

paul@conductiveresearch.com
**/
pragma solidity ^0.8.0;

import "https://github.com/ProjectOpenSea/opensea-creatures/blob/master/contracts/ERC721Tradable.sol";


/**
 * @title SwordNFT
 * SwordNFT - a contract for Swords of Gargantuan NFTs
 */
contract SwordNFT is ERC721Tradable {
  constructor(address _proxyRegistryAddress) ERC721Tradable("SwordNFT", "SOGNFT", _proxyRegistryAddress) public {  }

  function baseTokenURI() override public pure  returns (string memory) {
    return "https://www.firebox.cc/hyperperk/sword/";
  }
}