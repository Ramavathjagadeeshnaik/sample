// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract BetContract {
    struct Bet {
        uint256 id;
        string question;
        string[] choices;
        mapping(address => uint256) bets;
        uint256 amount;
        bool isActive;
        address createdBy;
        uint256 winningChoice;
    }

    struct BetInfo {
        uint256 id;
        string question;
        string[] choices;
        uint256 amountPlaced;
        bool[] choicesMade;
        bool isActive;
        uint256 winningChoice;
    }

    Bet[] public bets;
    uint256 public totalBets;

    mapping(address => bool) public registeredUsers;
    mapping(address => uint256) public winnings;
    mapping(address => mapping(uint256 => bool)) public userBetPlaced;

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], 'User is not registered');
        _;
    }

    event BetCreated(uint256 id, string question, string[] choices);
    event BetPlaced(uint256 betId, address bettor, uint256 choice, uint256 amount);
    event BetWinnerDeclared(uint256 betId, uint256 winningChoice);

    function registerUser() external {
        registeredUsers[msg.sender] = true;
    }

    function getBet(uint256 _betId) external view returns (BetInfo memory) {
        require(_betId < totalBets, 'Invalid bet ID');
        Bet storage bet = bets[_betId];
        BetInfo memory betInfo;
        betInfo.id = bet.id;
        betInfo.question = bet.question;
        betInfo.choices = bet.choices;
        betInfo.amountPlaced = bet.bets[msg.sender];
        betInfo.choicesMade = new bool[](bet.choices.length);
        betInfo.isActive = bet.isActive;
        betInfo.winningChoice = bet.winningChoice;

        for (uint256 i = 0; i < bet.choices.length; i++) {
            betInfo.choicesMade[i] = (bet.bets[msg.sender] == i);
        }

        return betInfo;
    }

    function createBet(string memory _question, string[] memory _choices) external onlyRegistered {
        Bet storage newBet = bets.push();
        newBet.id = totalBets;
        newBet.question = _question;
        newBet.choices = _choices;
        newBet.isActive = true;
        newBet.createdBy = msg.sender;
        totalBets++;
        emit BetCreated(newBet.id, newBet.question, newBet.choices);
    }

    function placeBet(uint256 _betId, uint256 _choice) external payable onlyRegistered {
        require(_betId < totalBets, 'Invalid bet ID');
        Bet storage bet = bets[_betId];
        require(_choice < bet.choices.length, 'Invalid choice');
        require(bet.isActive, 'Bet is not active');
        require(msg.value > 0, 'Incorrect bet amount');
        require(!userBetPlaced[msg.sender][_betId], 'Bet already placed by the user');

        bet.bets[msg.sender] += msg.value;
        userBetPlaced[msg.sender][_betId] = true;
        emit BetPlaced(_betId, msg.sender, _choice, msg.value);
    }

    function declareWinner(uint256 _betId, uint256 _winningChoice) external {
        require(_betId < totalBets, 'Invalid bet ID');
        Bet storage bet = bets[_betId];
        require(msg.sender == bet.createdBy, 'Only the creator can declare the winner');
        require(_winningChoice < bet.choices.length, 'Invalid winning choice');
        require(bet.isActive, 'Bet is not active');

        bet.isActive = false;
        bet.winningChoice = _winningChoice;
        emit BetWinnerDeclared(_betId, _winningChoice);

        uint256 totalAmount = address(this).balance;
        uint256 winningAmount = 0;
        uint256 totalWinners = 0;

        // Calculate the total winning amount and count the number of winners
        for (uint256 i = 0; i < bet.choices.length; i++) {
            if (i == _winningChoice) {
                totalWinners++;
            }
        }

        // Distribute winnings to the winners and refund the remaining amount to participants
        for (uint256 i = 0; i < bet.choices.length; i++) {
            address bettor = address(uint160(i));
            uint256 betAmount = bet.bets[bettor];
            if (i == _winningChoice) {
                uint256 winAmount = (totalAmount * betAmount) / (bet.amount * totalWinners);
                winnings[bettor] += winAmount;
                winningAmount += winAmount;
            } else {
                payable(bettor).transfer(betAmount);
            }
            bet.bets[bettor] = 0;
        }

        // Refund any remaining amount to the contract owner
        uint256 remainingAmount = totalAmount - winningAmount;
        if (remainingAmount > 0) {
            payable(bet.createdBy).transfer(remainingAmount);
        }
    }
}
