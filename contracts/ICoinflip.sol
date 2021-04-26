pragma solidity =0.8.4;

interface ICoinflip {
    
    function flip(uint8) external payable;
    function withdrawPlayerWinnings() external;
    function withdrawContract() external;
    function withdrawLink() external;
    function addPlayerWinnings(address _receipient) external payable;

    function getWinningsBalance() external view returns(uint256);
    function getTotalValue() external view returns(uint256);
    function getLinkBalance() external view returns(uint);

}