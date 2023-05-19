const BetCard = ({
    bet,
    selectedBet,
    handleBetSelection,
    declareWinner,
    handleChoiceSelection,
    selectedChoice,
    betAmount,
    setBetAmount,
    placeBet,
    setSelectedBet,
    userBets,
}) => {
    const isSelected = selectedBet && selectedBet.id === bet.id;

    return (
        <div className="col-md-4">
            <div className="card bg-light mb-3">
                <div className="card-body">
                    <h3 className="card-title text-dark">{bet.question}</h3>
                    <p className="card-text text-dark">Choices: {bet.choices.join(', ')}</p>
                </div>
                {userBets && (
                    <div className="card-footer">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-between mb-2 text-dark">
                                        Your Choice: {bet.selectedChoice}
                                        <br />
                                        Amount Placed:{bet.amountPlaced}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!userBets && (
                    <div className="card-footer">
                        {isSelected ? (
                            <div className="card-body">
                                <h3 className="card-title text-dark">Place a bet</h3>
                                <select
                                    className="form-select mb-2 btn-dark-mode bg-light text-dark"
                                    value={selectedChoice}
                                    onChange={(e) => handleChoiceSelection(e.target.value)}
                                >
                                    {bet.choices.map((choice, index) => (
                                        <option
                                            key={index}
                                            value={index.toString()}
                                            className="text-dark"
                                        >
                                            {choice}
                                        </option>
                                    ))}
                                </select>
                                <div className="col-md-6">
                                    <input
                                        type="number"
                                        className="form-select mb-2 btn-dark-mode bg-light text-dark"
                                        placeholder="Enter Amount"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-between mb-2">
                                            <button
                                                className="btn btn-success mr-2 btn-dark-mode"
                                                onClick={placeBet}
                                            >
                                                Place Bet
                                            </button>
                                            <button
                                                className="btn btn-danger btn-dark-mode"
                                                onClick={declareWinner}
                                            >
                                                Declare Winner
                                            </button>
                                            <button
                                                className="btn text-secondary btn-dark-mode"
                                                onClick={() => setSelectedBet(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary btn-dark-mode"
                                onClick={() => handleBetSelection(bet)}
                            >
                                Select Bet
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BetCard;
