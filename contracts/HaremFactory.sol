pragma solidity 0.5.0;

import './utils/Ownable.sol';
import './utils/SafeMath.sol';
import './utils/IERC20.sol';
import './HaremNonTradable.sol';

contract HaremFactory is Ownable {
    using SafeMath for uint256;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of Harems
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accHaremPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws tokens to a pool. Here's what happens:
        //   1. The pool's `accHaremPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 token; // Address of token contract.
        uint256 haremsPerDay; // The amount of Harems per day generated for each token staked
        uint256 maxStake; // The maximum amount of tokens which can be staked in this pool
        uint256 lastUpdateTime; // Last timestamp that Harems distribution occurs.
        uint256 accHaremPerShare; // Accumulated Harems per share, times 1e12. See below.
    }

    // Treasury address.
    address public treasuryAddr;
    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Record whether the pair has been added.
    mapping(address => uint256) public tokenPID;

    HaremNonTradable public Harem;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(HaremNonTradable _haremAddress, address _treasuryAddr) public {
        Harem = _haremAddress;
        treasuryAddr = _treasuryAddr;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new token to the pool. Can only be called by the owner.
    // XXX DO NOT add the same token more than once. Rewards will be messed up if you do.
    function add(IERC20 _token, uint256 _haremsPerDay, uint256 _maxStake) public onlyOwner {
        require(tokenPID[address(_token)] == 0, "GiverOfHarem:duplicate add.");
        require(address(_token) != address(Harem), "Cannot add Harem as a pool" );
        poolInfo.push(
            PoolInfo({
                token: _token,
                maxStake: _maxStake,
                haremsPerDay: _haremsPerDay,
                lastUpdateTime: block.timestamp,
                accHaremPerShare: 0
            })
        );
        tokenPID[address(_token)] = poolInfo.length;
    }

    // Set a new max stake. Value must be greater than previous one,
    // to not give an unfair advantage to people who already staked > new max
    function setMaxStake(uint256 pid, uint256 amount) public onlyOwner {
        require(amount >= 0, "Max stake cannot be negative");
        poolInfo[pid].maxStake = amount;
    }

    // Set the amount of Harems generated per day for each token staked
    function setHaremsPerDay(uint256 pid, uint256 amount) public onlyOwner {
        require(amount >= 0, "Harems per day cannot be negative");
        updatePool(pid);
        poolInfo[pid].haremsPerDay = amount;
    }

    // View function to see pending Harems on frontend.
    function pendingHarem(uint256 _pid, address _user) public view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 blockTime = block.timestamp;
        uint256 accHaremPerShare = pool.accHaremPerShare;
        uint256 tokenSupply = pool.token.balanceOf(address(this));
        if (blockTime > pool.lastUpdateTime && tokenSupply != 0) {
            uint256 haremReward = pendingHaremOfPool(_pid);
            accHaremPerShare = accHaremPerShare.add(haremReward.mul(1e12).div(tokenSupply));
        }
        return user.amount.mul(accHaremPerShare).div(1e12).sub(user.rewardDebt);
    }

    // View function to calculate the total pending Harems of address across all pools
    function totalPendingHarem(address _user) public view returns (uint256) {
        uint256 total = 0;
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            total = total.add(pendingHarem(pid, _user));
        }

        return total;
    }

    // View function to see pending Harems on the whole pool
    function pendingHaremOfPool(uint256 _pid) public view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        uint256 blockTime = block.timestamp;
        uint256 tokenSupply = pool.token.balanceOf(address(this));
        return blockTime.sub(pool.lastUpdateTime).mul(tokenSupply.mul(pool.haremsPerDay).div(1000000000000000000).div(86400));
    }

    // Harvest pending Harems of a list of pools.
    // Be careful of gas spending if you try to harvest a big number of pools
    // Might be worth it checking in the frontend for the pool IDs with pending Harem for this address and only harvest those
    function rugPull(uint256[] memory _pids) public {
        for (uint i=0; i < _pids.length; i++) {
            withdraw(_pids[i], 0);
        }
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function rugPullAll() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.timestamp <= pool.lastUpdateTime) {
            return;
        }
        if (pool.haremsPerDay == 0) {
            pool.lastUpdateTime = block.timestamp;
            return;
        }
        uint256 tokenSupply = pool.token.balanceOf(address(this));
        if (tokenSupply == 0) {
            pool.lastUpdateTime = block.timestamp;
            return;
        }

        // return blockTime.sub(lastUpdateTime[account]).mul(balanceOf(account).mul(haremsPerDay).div(86400));
        uint256 haremReward = pendingHaremOfPool(_pid);
        //Harem.mint(treasuryAddr, haremReward.div(40)); // 2.5% Harem for the treasury (Usable to purchase NFTs)
        Harem.mint(address(this), haremReward);

        pool.accHaremPerShare = pool.accHaremPerShare.add(haremReward.mul(1e12).div(tokenSupply));
        pool.lastUpdateTime = block.timestamp;
    }

    // Deposit LP tokens to pool for Harem allocation.
    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        require(_amount.add(user.amount) <= pool.maxStake, "Cannot stake beyond maxStake value");

        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accHaremPerShare).div(1e12).sub(user.rewardDebt);
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accHaremPerShare).div(1e12);
        if (pending > 0) safeHaremTransfer(msg.sender, pending);
        pool.token.transferFrom(address(msg.sender), address(this), _amount);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw tokens from pool.
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accHaremPerShare).div(1e12).sub(user.rewardDebt);

        // In case the maxStake has been lowered and address is above maxStake, we force it to withdraw what is above current maxStake
        // User can delay his/her withdraw/harvest to take advantage of a reducing of maxStake,
        // if he/she entered the pool at maxStake before the maxStake reducing occured
        uint256 leftAfterWithdraw = user.amount.sub(_amount);
        if (leftAfterWithdraw > pool.maxStake) {
            _amount = _amount.add(leftAfterWithdraw - pool.maxStake);
        }

        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accHaremPerShare).div(1e12);
        safeHaremTransfer(msg.sender, pending);
        pool.token.transfer(address(msg.sender), _amount);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount > 0, "emergencyWithdraw: not good");
        uint256 _amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.token.transfer(address(msg.sender), _amount);
        emit EmergencyWithdraw(msg.sender, _pid, _amount);
    }

    // Safe Harem transfer function, just in case if rounding error causes pool to not have enough Harems.
    function safeHaremTransfer(address _to, uint256 _amount) internal {
        uint256 haremBal = Harem.balanceOf(address(this));
        if (_amount > haremBal) {
            Harem.transfer(_to, haremBal);
            Harem.addClaimed(haremBal);
        } else {
            Harem.transfer(_to, _amount);
            Harem.addClaimed(_amount);
        }
    }

    // Update dev address by the previous dev.
    function treasury(address _treasuryAddr) public {
        require(msg.sender == treasuryAddr, "Must be called from current treasury address");
        treasuryAddr = _treasuryAddr;
    }
}