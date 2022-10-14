pragma solidity 0.5.0;

import './HaremNonTradable.sol';
import './utils/Ownable.sol';
import './NFT.sol';

contract HaremRedeem is Ownable {
    NFT public HMU;
    HaremNonTradable public Harem;
    mapping(uint256 => uint256) public cardCosts;

    event CardAdded(uint256 card, uint256 points);
    event Redeemed(address indexed user, uint256 amount);

    constructor(NFT _HMUAddress, HaremNonTradable _haremAddress) public {
        HMU = _HMUAddress;
        Harem = _haremAddress;
    }

    function addCard(uint256 cardId, uint256 amount) public onlyOwner {
        require( amount >= 0, 'price amount not correct');
        cardCosts[cardId] = amount;
        emit CardAdded(cardId, amount);
    }

    function redeem(uint256 card) public {
        require(cardCosts[card] != 0, "Card not found");
        require(Harem.balanceOf(msg.sender) >= cardCosts[card], "Not enough points to redeem for card");
        require(HMU.totalSupply(card) < HMU.maxSupply(card), "Max cards minted");

        Harem.burn(msg.sender, cardCosts[card]);
        HMU.mint(msg.sender, card, 1, "");
        emit Redeemed(msg.sender, cardCosts[card]);
    }
}