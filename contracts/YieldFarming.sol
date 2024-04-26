// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YieldFarming
 * @dev Contract to manage the staking of tokens and the distribution of yield.
 * Users can stake commodity-backed tokens and earn yield in another asset.
 */
contract YieldFarming is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;
    IERC20 public rewardToken;

    uint256 public totalStaked;
    mapping(address => uint256) public balances;
    address[] public stakers; // Array to keep track of all stakers

    /**
     * @dev Emitted when a user stakes tokens.
     * @param user The user who staked tokens.
     * @param amount The amount of tokens staked.
     */
    event Staked(address indexed user, uint256 amount);

    /**
     * @dev Emitted when a user withdraws their staked tokens.
     * @param user The user who withdrew tokens.
     * @param amount The amount of tokens withdrawn.
     */
    event Unstaked(address indexed user, uint256 amount);

    /**
     * @dev Constructor to set the staking and reward tokens.
     * @param _stakingToken The token users will stake.
     * @param _rewardToken The token users will receive as a reward.
     */
    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    /**
     * @dev Allows users to stake tokens.
     * @param amount The amount of tokens to be staked.
     */
    function stake(uint256 amount) public nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Stake failed");

        balances[msg.sender] += amount;
        totalStaked += amount;
        if(balances[msg.sender] == amount) { // Check if the user is a new staker
            stakers.push(msg.sender);
        }
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Allows users to withdraw their staked tokens.
     * @param amount The amount of tokens to be withdrawn.
     */
    function unstake(uint256 amount) public nonReentrant {
        require(amount > 0, "Cannot unstake 0 tokens");
        require(balances[msg.sender] >= amount, "Insufficient balance to unstake");

        balances[msg.sender] -= amount;
        totalStaked -= amount;
        if(balances[msg.sender] == 0) {
            // Remove staker from the array if their balance is zero
            for(uint i = 0; i < stakers.length; i++) {
                if(stakers[i] == msg.sender) {
                    stakers[i] = stakers[stakers.length - 1]; // Move the last element to the deleted spot
                    stakers.pop(); // Remove the last element
                    break;
                }
            }
        }
        require(stakingToken.transfer(msg.sender, amount), "Unstake failed");

        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Distributes reward tokens to stakers based on their staking balances.
     */
    function distributeRewards() public onlyOwner {
        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint256 userBalance = balances[staker];
            if (userBalance > 0) {
                uint256 reward = calculateReward(userBalance);
                require(rewardToken.transfer(staker, reward), "Reward distribution failed");
            }
        }
    }

    /**
     * @dev Calculates the reward for a given amount of staked tokens.
     * @param _amount The amount of staked tokens.
     * @return The amount of reward tokens.
     */
    function calculateReward(uint256 _amount) private pure returns (uint256) {
        // Reward calculation logic here
        return _amount / 100; // Example calculation: 1% of staked amount as reward
    }
}
