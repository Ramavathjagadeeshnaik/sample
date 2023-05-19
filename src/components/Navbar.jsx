const Navbar = ({ isWalletConnected, walletAddress, connectWallet, openCreateBetModal }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3 p-3">
            <a className="navbar-brand" href="#">
                YouBet
            </a>
            <div className="collapse navbar-collapse justify-content-end">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        {isWalletConnected ? (
                            <span className="nav-link text-light">{walletAddress}</span>
                        ) : (
                            <button
                                className="btn btn-light btn-dark-mode text-dark nav-link"
                                onClick={connectWallet}
                            >
                                Connect Wallet
                            </button>
                        )}
                    </li>
                    <li className="nav-item">
                        <button
                            className="btn btn-light ml-3 btn-dark-mode"
                            onClick={openCreateBetModal}
                        >
                            Create Bet
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
