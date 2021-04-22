pragma solidity =0.8.3;

import "./ICoinflip.sol";
import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBase.sol";

/// @title Coinflip Simulator
/// @author Andrew Fleming
contract Coinflip is ICoinflip, VRFConsumerBase {

    string public name = "Coinflip";
    uint256 public contractBalance;
    uint256 internal fee;
    bytes32 internal keyHash;
    address public owner;

    /// @notice The Bet struct 
    struct Bet {
        address playerAddress;
        bytes32 requestId;
        uint256 betAmount; 
        uint256 headsTails;
    }
    
    ///@dev address => winnings amount
    mapping(address => uint256) public playerWinnings;
    ///@dev address => Bet instance
    mapping(address => Bet) public waiting;
    ///@dev requestId => address
    mapping(bytes32 => address) public afterWaiting;
    
    /**
     * @param _coorAddr Chainlink's VRF coordinator address
     * @param _linkAddr Chainlink token address
     * @param _keyHash Key for Chainlink oracle to know which job it should perform
     * @param _fee Chainlink's fee per random number query (varies by network)
     */
    constructor (
        address _coorAddr, 
        address _linkAddr,
        bytes32 _keyHash,
        uint256 _fee
        ) VRFConsumerBase(
            _coorAddr, 
            _linkAddr
            ) payable {
                require(msg.value > 1 ether, "Not enough ether");
                owner = msg.sender;
                contractBalance = msg.value;
                keyHash = _keyHash;
                fee = _fee;
        }
    
    /**
     * @notice flip is a core function of this contract. This calls the getRandomNumber function. !!CONTINUE!! 
     * @param _choice The user's choice where number zero equals heads and number one equals tails.
     */
    function flip(uint256 _choice) external override payable {
        require(msg.value > 0, "You need to place a bet");
        require(_choice < 2, "Must be heads or tails");
        bytes32 requestId = getRandomNumber();

        afterWaiting[requestId] = msg.sender;

        Bet memory newBetter;
        newBetter.playerAddress = msg.sender;
        newBetter.betAmount = msg.value;
        newBetter.headsTails = _choice;
        newBetter.requestId = requestId;

        waiting[msg.sender] = newBetter;
    }
    
    /**
     *
     *
     */
    function withdrawPlayerWinnings() external override {
        require(playerWinnings[msg.sender] > 0, "You don't have any funds to withdraw");
        uint256 toTransfer = playerWinnings[msg.sender];
        playerWinnings[msg.sender] = 0;
        payable(msg.sender).transfer(toTransfer);
    }
    
    /**
     * @param _recipient Address to increase winnings (for testing only)
     */
    function addPlayerWinnings(address _recipient) external override payable {
        require(msg.sender == owner, "You are not the owner");
        require(msg.value > 0, "You must send ether");
        playerWinnings[_recipient] += msg.value;
    }
    
    /**
     *
     */
    function withdrawLink() external override {
        require(msg.sender == owner, "You are not the owner");
        uint256 toTransfer = LINK.balanceOf(address(this));
        LINK.transfer(msg.sender, toTransfer);
    }
    
    /**
     *
     */
    function withdrawContract() external override {
        require(msg.sender == owner, "You are not the owner");
        uint256 toTransfer = contractBalance;
        contractBalance = 0;
        payable(owner).transfer(toTransfer);
        // EMIT EVENT
    }

    /**
     *
     */
    function getWinningsBalance() external view override returns (uint256) {
        return playerWinnings[msg.sender];
    }
    
    /**
     *
     */
    function getTotalValue() external view override returns (uint256) {
        require(msg.sender == owner, "You are not the owner");
        return address(this).balance;
    }

    /**
     *
     */
    function getLinkBalance() external view override returns (uint256){
        return LINK.balanceOf(address(this));
    }

    /**
     *
     */
    function getRandomNumber() internal returns (bytes32 requestId) {
        // Pseudo-random userSeed for LINK's random function
        uint256 userSeed = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1))));
        return requestRandomness(keyHash, fee, userSeed);
    }

    /**
     * @param _requestId Identifier that associates the random number request with a bytes32
     * @param _randomness Returned random number from Chainlink's oracle
     */
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        uint256 randomNum = _randomness % 2;
        address _player = afterWaiting[_requestId];

        Bet memory postBet = waiting[_player];
        if(randomNum == postBet.headsTails){
            //winner
            uint winAmount = postBet.betAmount * 2;
            contractBalance -= postBet.betAmount;
            playerWinnings[_player] += winAmount;
            
        } else {
            //loser
            contractBalance += postBet.betAmount;
        }     
    }
    
}