// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@uma/core/contracts/oracle/interfaces/OptimisticOracleV2Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OO_BetHandler is ReentrancyGuard {
    OptimisticOracleV2Interface oo =
        OptimisticOracleV2Interface(0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884);

    uint256 requestTime = 0; // Store the request time so we can re-use it later.
    bytes32 constant IDENTIFIER = bytes32("YES_OR_NO_QUERY"); // Use the yes no idetifier to ask arbitary questions, such as the weather on a particular day.
    address constant ZERO_ADDRESS = address(0);
    // 0x0000000000000000000000000000000000000000
    //

    struct Bet {
        uint256 betId;
        bytes question;
        uint256 expiry;
        IERC20 bondCurrency;
        address creator;
        bool privateBet;
        uint256 liveness;
        uint256 reward;
        bytes imgUrl;
        BetStatus betStatus;
    }

    struct BetAmount {
        uint256 betId;
        address affirmation; // Address of the side of the bet that affirms the question.
        IERC20 affirmationToken;
        uint256 affirmationAmount; // Amount deposited into the bet by the affrimation.
        address negation; // Address of the side of the bet that negates the question.
        IERC20 negationToken;
        uint256 negationAmount; // Amount deposited into the bet by the negation.
    }

    enum BetStatus {
        LOADING,
        OPEN,
        ACTIVE,
        SETTLING,
        SETTLED,
        CLAIMED,
        DEAD
    }

    // ******** EVENTS ************

    event BetSet(
        address indexed creator,
        uint256 indexed betId,
        bytes indexed ancillaryData
    );

    event BetTaken(address indexed taker, uint256 indexed betId);

    event DataRequested(
        address indexed affirmation,
        address indexed negation,
        uint256 indexed betId
    );

    event BetSettled(
        address indexed affirmation,
        address indexed negation,
        uint256 indexed betId
    );

    event WinningsClaimed(
        uint256 indexed betId,
        uint256 indexed totalWinnings,
        int256 indexed winner
    );

    event BetCanceled(
        uint256 indexed betId,
        address indexed bondCurrency,
        uint256 indexed refundAmount
    );

    event BetKilled(
        uint256 indexed betId,
        uint256 indexed affirmationRefund,
        uint256 indexed negationRefund
    );

    uint256 public betId = 0; // latest global betId for all managed bets.
    mapping(uint256 => Bet) public bets; // All bets mapped by their betId
    mapping(bytes => uint256) public hashIds; // A hash of bet question, msg.sender, and timestamp to betId
    mapping(uint256 => BetAmount) public betAmounts; // All bet amounts mapped by their betId.
    mapping(address => uint256[]) public userBets; // All bets the user is and has participated in.

    // ********* MUTATIVE FUNCTIONS *************

    function setBet(
        bytes calldata _question,
        uint256 _expiry,
        IERC20 _bondCurrency,
        uint256 _liveness,
        uint256 _reward,
        bool _privateBet,
        bytes calldata _imgUrl
    ) public nonReentrant {
        Bet memory bet = Bet(
            betId,
            _question,
            _expiry,
            _bondCurrency,
            msg.sender,
            _privateBet,
            _liveness,
            _reward,
            _imgUrl,
            BetStatus.LOADING
        );

        bytes memory hashId = abi.encode(
            _question,
            msg.sender,
            block.timestamp
        );

        emit BetSet(msg.sender, betId, _question);

        bets[betId] = bet;
        hashIds[hashId] = betId;
        userBets[msg.sender].push(betId);
        betId += 1;
    }

    function loadBet(
        uint256 _betId,
        address _affirmation,
        IERC20 _affirmationToken,
        uint256 _affirmationAmount,
        address _negation,
        IERC20 _negationToken,
        uint256 _negationAmount
    ) public nonReentrant {
        Bet storage bet = bets[_betId];
        require(msg.sender == bet.creator, "not creator");
        require(
            bet.creator == _affirmation || bet.creator == _negation,
            "must be participant"
        );
        require(_affirmation != _negation, "must have separate parties");
        require(bet.betStatus == BetStatus.LOADING, "not loading");

        BetAmount memory betAmount = BetAmount(
            _betId,
            _affirmation,
            _affirmationToken,
            _affirmationAmount,
            _negation,
            _negationToken,
            _negationAmount
        );

        // Make sure to approve this contract to spend your ERC20 externally first
        if (msg.sender == _affirmation) {
            _affirmationToken.transferFrom(
                msg.sender,
                address(this),
                _affirmationAmount
            );
        } else if (msg.sender == _negation) {
            _negationToken.transferFrom(
                msg.sender,
                address(this),
                _negationAmount
            );
        }

        betAmounts[_betId] = betAmount;
        bet.betStatus = BetStatus.OPEN;
    }

    function takeBet(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        require(msg.sender != bet.creator, "Can't take your own bet");
        if (bet.privateBet == false) {
            require(
                betAmount.affirmation == ZERO_ADDRESS ||
                    betAmount.negation == ZERO_ADDRESS,
                "Bet already taken"
            );
        } else {
            require(
                msg.sender == betAmount.affirmation ||
                    msg.sender == betAmount.negation,
                "Not bet recipient"
            );
        }
        require(bet.betStatus == BetStatus.OPEN, "not Open");

        if (betAmount.affirmation == ZERO_ADDRESS) {
            // Make sure to approve this contract to spend your ERC20 externally first
            bet.bondCurrency.transferFrom(
                msg.sender,
                address(this),
                betAmount.affirmationAmount
            );
            betAmount.affirmation = msg.sender;
        } else {
            // Make sure to approve this contract to spend your ERC20 externally first
            bet.bondCurrency.transferFrom(
                msg.sender,
                address(this),
                betAmount.negationAmount
            );
            betAmount.negation = msg.sender;
        }

        userBets[msg.sender].push(_betId);
        bet.betStatus = BetStatus.ACTIVE;

        emit BetTaken(msg.sender, _betId);
    }

    function requestData(uint256 _betId) public {
        Bet storage bet = bets[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        require(
            bet.betStatus == BetStatus.ACTIVE,
            "Bet not ready to be settled"
        );
        require(
            betAmount.affirmation == msg.sender ||
                betAmount.negation == msg.sender
        );

        bytes memory ancillaryData = bet.question; // Question to ask the UMA Oracle.

        requestTime = block.timestamp; // Set the request time to the current block time.
        IERC20 bondCurrency = IERC20(bet.bondCurrency); // Use preferred token as the bond currency.
        uint256 reward = bet.reward; // Set the reward amount for UMA Oracle.

        // Set liveness for request disputes measured in seconds. Recommended time is at least 7200 (2 hours).
        // Users should increase liveness time depending on various factors such as amount of funds being handled
        // and risk of malicious acts.
        uint256 liveness = bet.liveness;

        // Now, make the price request to the Optimistic oracle with preferred inputs.
        oo.requestPrice(
            IDENTIFIER,
            requestTime,
            ancillaryData,
            bondCurrency,
            reward
        );
        oo.setCustomLiveness(IDENTIFIER, requestTime, ancillaryData, liveness);

        bet.betStatus = BetStatus.SETTLING;
        emit DataRequested(
            betAmount.affirmation,
            betAmount.negation,
            betAmount.betId
        );
    }

    // Settle the request once it's gone through the liveness period of 30 seconds. This acts the finalize the voted on price.
    // In a real world use of the Optimistic Oracle this should be longer to give time to disputers to catch bat price proposals.
    function settleRequest(uint256 _betId) public {
        Bet storage bet = bets[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        require(bet.betStatus == BetStatus.SETTLING, "Bet not settling");
        require(
            betAmount.affirmation == msg.sender ||
                betAmount.negation == msg.sender
        );

        bytes memory ancillaryData = bet.question;

        oo.settle(address(this), IDENTIFIER, requestTime, ancillaryData);
        bet.betStatus = BetStatus.SETTLED;

        emit BetSettled(
            betAmount.affirmation,
            betAmount.negation,
            betAmount.betId
        );
    }

    function claimWinnings(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        uint256 totalWinnings = betAmount.affirmationAmount +
            betAmount.negationAmount;
        int256 settlementData = getSettledData(_betId);
        require(bet.betStatus == BetStatus.SETTLED, "Bet not yet settled");
        require(
            msg.sender == betAmount.affirmation ||
                msg.sender == betAmount.negation,
            "This is not your bet"
        );
        require(
            settlementData == 1e18 || settlementData == 0,
            "Invalid settlement"
        );
        if (settlementData == 1e18) {
            require(
                msg.sender == betAmount.affirmation,
                "Negation did not win bet"
            );
            bet.bondCurrency.transfer(betAmount.affirmation, totalWinnings);
        } else {
            require(
                msg.sender == betAmount.negation,
                "Affirmation did not win bet"
            );
            bet.bondCurrency.transfer(betAmount.negation, totalWinnings);
        }

        bet.betStatus = BetStatus.CLAIMED;

        emit WinningsClaimed(bet.betId, totalWinnings, settlementData);
    }

    function cancelBet(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        uint256 refundAmount;
        require(
            bet.betStatus == BetStatus.LOADING ||
                bet.betStatus == BetStatus.OPEN,
            "Bet already active"
        );
        require(msg.sender == bet.creator, "Not bet creator");

        if (bet.creator == betAmount.affirmation) {
            refundAmount = betAmount.affirmationAmount;
        } else {
            refundAmount = betAmount.negationAmount;
        }

        bet.bondCurrency.transfer(bet.creator, refundAmount);

        emit BetCanceled(bet.betId, address(bet.bondCurrency), refundAmount);
    }

    function killBet(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        int256 settlementData = getSettledData(_betId);
        require(bet.betStatus == BetStatus.SETTLED, "Bet not yet settled");
        require(
            msg.sender == betAmount.affirmation ||
                msg.sender == betAmount.negation,
            "This is not your bet"
        );
        require(settlementData == 2 * 1e18, "Bet is settleable");
        bet.bondCurrency.transfer(
            betAmount.affirmation,
            betAmount.affirmationAmount
        );
        bet.bondCurrency.transfer(betAmount.negation, betAmount.negationAmount);

        bet.betStatus = BetStatus.DEAD;

        emit BetKilled(
            betAmount.betId,
            betAmount.affirmationAmount,
            betAmount.negationAmount
        );
    }

    //******* VIEW FUNCTIONS ***********
    function createQuestion(string memory _question)
        public
        pure
        returns (bytes memory)
    {
        bytes memory question = bytes(
            string.concat(
                "Q: ",
                _question,
                "? --- A:1 for yes. 0 for no. 2 for ambiguous/unknowable"
            )
        );
        return question;
    }

    // Fetch the resolved price from the Optimistic Oracle that was settled.
    function getSettledData(uint256 _betId) public view returns (int256) {
        Bet storage bet = bets[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        require(
            betAmount.affirmation == msg.sender ||
                betAmount.negation == msg.sender
        );

        return
            oo
                .getRequest(
                    address(this),
                    IDENTIFIER,
                    requestTime,
                    bet.question
                )
                .resolvedPrice;
    }

    function getHashId(bytes calldata _question, uint256 timestamp)
        public
        view
        returns (bytes memory)
    {
        return abi.encode(_question, msg.sender, timestamp);
    }

    function stringEncode(string calldata _string)
        public
        pure
        returns (bytes memory)
    {
        return bytes(_string);
    }

    function stringDecode(bytes calldata _bytes)
        public
        pure
        returns (string memory)
    {
        return string(_bytes);
    }
}
