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

----------------------------
Secondary Non-tradable Token
----------------------------

paul@conductiveresearch.com
credits: Waifu team template

**/
pragma solidity 0.5.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal { }
    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

pragma solidity 0.5.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// File: contracts-waifu/waif/utils/SafeMath.sol
pragma solidity 0.5.0;
/**
 * @title SafeMath
 * @dev Unsigned math operations with safety checks that revert on error
 */
library SafeMath {

    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath#mul: OVERFLOW");

        return c;
    }

    /**
     * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath#div: DIVISION_BY_ZERO");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath#sub: UNDERFLOW");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath#add: OVERFLOW");

        return c;
    }

    /**
     * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath#mod: DIVISION_BY_ZERO");
        return a % b;
    }

}

// File: contracts-waifu/waif/utils/Roles.sol
pragma solidity 0.5.0;
/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}

// File: contracts-waifu/waif/utils/MinterRole.sol
pragma solidity 0.5.0;
contract MinterRole is Context {
    using Roles for Roles.Role;

    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    Roles.Role private _minters;

    constructor () internal {
        _addMinter(_msgSender());
    }

    modifier onlyMinter() {
        require(isMinter(_msgSender()), "MinterRole: caller does not have the Minter role");
        _;
    }

    function isMinter(address account) public view returns (bool) {
        return _minters.has(account);
    }

    function addMinter(address account) public onlyMinter {
        _addMinter(account);
    }

    function renounceMinter() public {
        _removeMinter(_msgSender());
    }

    function _addMinter(address account) internal {
        _minters.add(account);
        emit MinterAdded(account);
    }

    function _removeMinter(address account) internal {
        _minters.remove(account);
        emit MinterRemoved(account);
    }
}

pragma solidity ^0.5.0;
contract CanTransferRole is Context {
    using Roles for Roles.Role;

    event CanTransferAdded(address indexed account);
    event CanTransferRemoved(address indexed account);

    Roles.Role private _canTransfer;

    constructor () internal {
        _addCanTransfer(_msgSender());
    }

    modifier onlyCanTransfer() {
        require(canTransfer(_msgSender()), "CanTransferRole: caller does not have the CanTransfer role");
        _;
    }

    function canTransfer(address account) public view returns (bool) {
        return _canTransfer.has(account);
    }

    function addCanTransfer(address account) public onlyCanTransfer {
        _addCanTransfer(account);
    }

    function renounceCanTransfer() public {
        _removeCanTransfer(_msgSender());
    }

    function _addCanTransfer(address account) internal {
        _canTransfer.add(account);
        emit CanTransferAdded(account);
    }

    function _removeCanTransfer(address account) internal {
        _canTransfer.remove(account);
        emit CanTransferRemoved(account);
    }
}

contract SecondaryTokenNonTradable is Ownable, MinterRole, CanTransferRole {
    using SafeMath for uint256;
    event Transfer(address indexed from, address indexed to, uint256 value);

    mapping (address => uint256) private _balances;

    uint256 private _totalSupply;
    uint256 private _totalClaimed;
    string public name = "SHARD - Non Tradable NFT Token";
    string public symbol = "SHARD";
    uint8 public decimals = 18;

    /**
     * @dev Total number of tokens in existence.
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // Returns the total claimed SecondaryToken
    // This is just purely used to display the total SecondaryToken claimed by users on the frontend
    function totalClaimed() public view returns (uint256) {
        return _totalClaimed;
    }

    // Add SecondaryToken claimed
    function addClaimed(uint256 _amount) public onlyCanTransfer {
        _totalClaimed = _totalClaimed.add(_amount);
    }

    // Set SecondaryToken claimed to a custom value, for if we wanna reset the counter on new season release
    function setClaimed(uint256 _amount) public onlyCanTransfer {
        require(_amount >= 0, "Cant be negative");
        _totalClaimed = _amount;
    }

    // As this token is non tradable, only minters are allowed to transfer tokens between accounts
    function transfer(address receiver, uint numTokens) public onlyCanTransfer returns (bool) {
        require(numTokens <= _balances[msg.sender]);
        _balances[msg.sender] = _balances[msg.sender].sub(numTokens);
        _balances[receiver] = _balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    // As this token is non tradable, only minters are allowed to transfer tokens between accounts
    function transferFrom(address owner, address buyer, uint numTokens) public onlyCanTransfer returns (bool) {
        require(numTokens <= _balances[owner]);

        _balances[owner] = _balances[owner].sub(numTokens);
        _balances[buyer] = _balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     * @return A uint256 representing the amount owned by the passed address.
     */
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    function mint(address _to, uint256 _amount) public onlyMinter {
        _mint(_to, _amount);
    }

    function burn(address _account, uint256 value) public onlyCanTransfer {
        require(_balances[_account] >= value, "Cannot burn more than address has");
        _burn(_account, value);
    }

    /**
     * @dev Internal function that mints an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param account The account that will receive the created tokens.
     * @param value The amount that will be created.
     */
    function _mint(address account, uint256 value) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(value);
        _balances[account] = _balances[account].add(value);
        emit Transfer(address(0), account, value);
    }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account.
     * @param account The account whose tokens will be burnt.
     * @param value The amount that will be burnt.
     */
    function _burn(address account, uint256 value) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _totalSupply = _totalSupply.sub(value);
        _balances[account] = _balances[account].sub(value);
        emit Transfer(account, address(0), value);
    }
}