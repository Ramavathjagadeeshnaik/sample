import React, { useState, useEffect } from "react";
// import Swal from 'sweetalert2';
import Web3 from "web3";
import BetContract from "./abis/BetContract.json";
import { normalizeBets } from "./utils";
import BetCard from "./components/BetCard";
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [bets, setBets] = useState([]);
  const [selectedBet, setSelectedBet] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [betAmount, setBetAmount] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userBets, setUserBets] = useState([]);

  // State for create bet modal
  const [isCreateBetModalOpen, setIsCreateBetModalOpen] = useState(false);

  // Function to handle wallet connection
  const connectWallet = async () => {
    try {
      // Check if the browser has injected Web3
      if (window.ethereum) {
        // Connect to the wallet
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);
        loadContract(web3);
        loadAccounts(web3);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // const accounts = await web3.eth.getAccounts();
        // Check if the user is registered
        // const isRegistered = await contract.methods.registeredUsers(accounts[0]).call();
        const isRegistered = await contract.methods
          .registeredUsers(accounts[0])
          .call();

        if (!isRegistered) {
          // Register the user
          await contract.methods.registerUser().send({ from: accounts[0] });
          alert("User registered successfully!");
        }

        // Update the wallet connection status
        setIsWalletConnected(true);

        // You can also fetch the connected wallet address
        // For example:
        const address = accounts[0];
        setWalletAddress(address);

        // Additional logic or actions after connecting the wallet
        // ...
      } else {
        // Handle the case when Web3 is not available
        console.log("Web3 not found. Please install a wallet like MetaMask.");
      }
    } catch (error) {
      // Handle any errors that occurred during wallet connection
      console.error("Failed to connect to the wallet:", error);
    }
  };

  // Function to open create bet modal
  const openCreateBetModal = () => {
    setIsCreateBetModalOpen(true);
  };

  // Function to close create bet modal
  const closeCreateBetModal = () => {
    setIsCreateBetModalOpen(false);
  };

  const loadContract = async (web3Instance) => {
    try {
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = BetContract.networks[networkId];
      const contractInstance = new web3Instance.eth.Contract(
        BetContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contractInstance);
      loadBets(contractInstance);
    } catch (error) {
      console.error("Failed to load contract:", error);
    }
  };

  const loadAccounts = async (web3Instance) => {
    try {
      const accounts = await web3Instance.eth.getAccounts();
      setAccounts(accounts);
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  };

  const loadBets = async (contractInstance) => {
    try {
      const totalBets = await contractInstance.methods.totalBets().call();
      const loadedBets = [];
      for (let i = 0; i < totalBets; i++) {
        const bet = await contractInstance.methods.getBet(i).call();
        loadedBets.push(bet);
      }

      const formattedBets = normalizeBets(loadedBets).reverse();
      setBets(formattedBets);
    } catch (error) {
      console.error("Failed to load bets:", error);
    }
  };

  const loadUserBets = async () => {
    console.log("here");
    let betIds = [];
    try {
      for (let i in bets) {
        const isBetPlaced = await contract.methods
          .userBetPlaced(walletAddress, i)
          .call();
        if (isBetPlaced) {
          betIds.push(i);
        }
      }
      const userBets = bets.filter((bet) => betIds.includes(bet.id));
      setUserBets(userBets);
    } catch (error) {
      console.log("Failed to load user bets:", error);
    }
  };

  useEffect(() => {
    connectWallet();
    if (contract && walletAddress) {
      console.log("contract", contract);
      loadUserBets();
    }
    console.log(selectedChoice);
  }, [contract, walletAddress]);

  const createBet = async (question, choices) => {
    try {
      await contract.methods
        .createBet(question, choices)
        .send({ from: accounts[0], gas: 3000000 });
      loadBets(contract);
      closeCreateBetModal();
    } catch (error) {
      console.error("Failed to create bet:", error);
    }
  };

  const placeBet = async () => {
    try {
      const betId = selectedBet.id;

      await contract.methods
        .placeBet(betId, selectedChoice)
        .send({ from: accounts[0], value: betAmount });
      loadBets(contract);
    } catch (error) {
      alert(error.message);
      console.error("Failed to place bet:", error.message);
    }
  };

  const declareWinner = async () => {
    try {
      const betId = selectedBet.id;
      const winningChoice = selectedBet.choices.indexOf(selectedChoice);
      await contract.methods
        .declareWinner(betId, winningChoice)
        .send({ from: accounts[0] });
      loadBets(contract);
    } catch (error) {
      console.error("Failed to declare winner:", error);
    }
  };

  const handleBetSelection = (bet) => {
    setSelectedBet(bet);
    setSelectedChoice("");
    setBetAmount(0);
  };

  const handleChoiceSelection = (choice) => {
    setSelectedChoice(choice);
  };

  return (
    <div>
      <Navbar
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        connectWallet={connectWallet}
        openCreateBetModal={openCreateBetModal}
      />
      <div className="container text-light">
        <div className="bg-light">
          <h2 className="text-dark">Bets</h2>
          <div className="row">
            {bets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                selectedBet={selectedBet}
                handleBetSelection={handleBetSelection}
                betAmount={betAmount}
                declareWinner={declareWinner}
                handleChoiceSelection={handleChoiceSelection}
                placeBet={placeBet}
                selectedChoice={selectedChoice}
                setBetAmount={setBetAmount}
                setSelectedBet={setSelectedBet}
              />
            ))}
          </div>
          <h2 className="text-dark">Your Bets</h2>
          <div className="row">
            {userBets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                selectedBet={selectedBet}
                handleBetSelection={handleBetSelection}
                selectedChoice={selectedChoice}
                betAmount={betAmount}
                userBets
              />
            ))}
          </div>
          {/* Create Bet Modal */}
          <Modal isOpen={isCreateBetModalOpen} onClose={closeCreateBetModal}>
            <div className="modal-header">
              <h5 className="modal-title text-light">Create Bet</h5>
              <button
                type="button"
                className="close text-light"
                onClick={closeCreateBetModal}
              >
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-select mb-2 btn-dark-mode bg-dark text-light"
                  placeholder="Question"
                  id="question"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-select mb-2 btn-dark-mode bg-dark text-light"
                  placeholder="Choices (comma-separated)"
                  id="choices"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary btn-dark-mode"
                onClick={() => {
                  const question = document.getElementById("question").value;
                  const choices = document
                    .getElementById("choices")
                    .value.split(",");
                  createBet(question, choices);
                }}
              >
                Create Bet
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-dark-mode"
                onClick={closeCreateBetModal}
              >
                Close
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default App;
