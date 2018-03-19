pragma solidity ^0.4.20;

contract Casino {
   address public owner;
   uint256 public minimumBet;
   uint256 public totalBet;
   uint256 public numberOfBets;
   uint public deadlineMin;
   uint public deadline;
   uint256 public maxAmountOfBets = 10;

   address[] public players;

   struct Player {
      uint256 amountBet;
      uint256 numberSelected;
   }

   event NumberGenerated(uint256 numberWin);

   modifier afterDeadline() {
     require( now >= deadline );
      _;
   }

   // The address of the player and => the user info
   mapping(address => Player) public playerInfo;

   function() public payable {}

   function Casino(uint256 _minimumBet, uint _deadlineMin) public {
      owner = msg.sender;
      if(_minimumBet != 0 ) minimumBet = _minimumBet;
      if(_deadlineMin != 0) deadlineMin = _deadlineMin;
   }

   function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
   }

   function checkPlayerExists(address player) public constant returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
   }

   function changeRules(uint _deadlineMin, uint256 _minimumBet) public {
     require(owner == msg.sender);
     deadlineMin = _deadlineMin;
     minimumBet = _minimumBet;
   }

   // To bet for a number between 1 and 10 both inclusive
   function bet(uint256 numberSelected) public payable {
      require(!checkPlayerExists(msg.sender));
      require(numberSelected >= 1 && numberSelected <= 10);
      require(msg.value >= minimumBet);

      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].numberSelected = numberSelected;
      numberOfBets++;

      if(numberOfBets == 1){
        deadline = now + (deadlineMin * 1 minutes);
      }

      players.push(msg.sender);
      totalBet += msg.value;
   }

   // Generates a number between 1 and 10 that will be the winner
   function generateNumberWinner() public afterDeadline {
      uint numberGenerated = block.number % 10 + 1; // This isn't secure
      msg.sender.transfer(100 finney);

      distributePrizes(numberGenerated);
      NumberGenerated(numberGenerated);
   }

   function resetData() internal {
     players.length = 0; // Delete all the players array
     totalBet = 0;
     numberOfBets = 0;
     deadline = 0;
   }

   // Sends the corresponding ether to each winner depending on the total bets
   function distributePrizes(uint256 numberWinner) internal {
      address[100] memory winners; // We have to create a temporary in memory array with fixed size
      uint256 count = 0; // This is the count for the array of winners

      for(uint256 i = 0; i < players.length; i++){
         address playerAddress = players[i];
         if(playerInfo[playerAddress].numberSelected == numberWinner){
            winners[count] = playerAddress;
            count++;
         }
         delete playerInfo[playerAddress]; // Delete all the players
      }

      uint256 winnerEtherAmount = totalBet / winners.length; // How much each winner gets

      for(uint256 j = 0; j < count; j++){
         if(winners[j] != address(0)) // Check that the address in this fixed array is not empty
         winners[j].transfer(winnerEtherAmount);
      }
      resetData();
   }
}
