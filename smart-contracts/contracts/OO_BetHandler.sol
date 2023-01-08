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

    struct BetDetails {
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

    struct Bet {
        uint256 betId;
        BetDetails betDetails;
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
    mapping(uint256 => BetDetails) public betDetails; // All bets mapped by their betId
    mapping(bytes => uint256) public hashIds; // A hash of bet question, msg.sender, and timestamp to betId
    mapping(uint256 => Bet) public bets; // All bet amounts mapped by their betId.
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
        BetDetails memory bet = BetDetails(
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

        betDetails[betId] = bet;
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
        BetDetails storage betDetails = betDetails[_betId];
        require(msg.sender == betDetails.creator, "not creator");
        require(_affirmation != _negation, "must have separate parties");
        require(betDetails.betStatus == BetStatus.LOADING, "not loading");

        Bet memory bet = Bet(
            _betId,
            betDetails,
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

        bet.betDetails.betStatus = BetStatus.OPEN;
        bets[_betId] = bet;
    }

    function takeBet(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        require(
            msg.sender != bet.betDetails.creator,
            "Can't take your own bet"
        );
        if (bet.betDetails.privateBet == false) {
            require(
                bet.affirmation == ZERO_ADDRESS || bet.negation == ZERO_ADDRESS,
                "Bet already taken"
            );
        } else {
            require(
                msg.sender == bet.affirmation || msg.sender == bet.negation,
                "Not bet recipient"
            );
        }
        require(bet.betDetails.betStatus == BetStatus.OPEN, "not Open");

        if (bet.affirmation == ZERO_ADDRESS) {
            // Make sure to approve this contract to spend your ERC20 externally first
            bet.betDetails.bondCurrency.transferFrom(
                msg.sender,
                address(this),
                bet.affirmationAmount
            );
            bet.affirmation = msg.sender;
        } else {
            // Make sure to approve this contract to spend your ERC20 externally first
            bet.betDetails.bondCurrency.transferFrom(
                msg.sender,
                address(this),
                bet.negationAmount
            );
            bet.negation = msg.sender;
        }

        userBets[msg.sender].push(_betId);
        bet.betDetails.betStatus = BetStatus.ACTIVE;

        emit BetTaken(msg.sender, _betId);
    }

    function requestData(uint256 _betId) public {
        Bet storage bet = bets[_betId];
        require(
            bet.betDetails.betStatus == BetStatus.ACTIVE,
            "Bet not ready to be settled"
        );
        require(bet.affirmation == msg.sender || bet.negation == msg.sender);

        bytes memory ancillaryData = bet.betDetails.question; // Question to ask the UMA Oracle.

        requestTime = block.timestamp; // Set the request time to the current block time.
        IERC20 bondCurrency = IERC20(bet.betDetails.bondCurrency); // Use preferred token as the bond currency.
        uint256 reward = bet.betDetails.reward; // Set the reward amount for UMA Oracle.

        // Set liveness for request disputes measured in seconds. Recommended time is at least 7200 (2 hours).
        // Users should increase liveness time depending on various factors such as amount of funds being handled
        // and risk of malicious acts.
        uint256 liveness = bet.betDetails.liveness;

        // Now, make the price request to the Optimistic oracle with preferred inputs.
        oo.requestPrice(
            IDENTIFIER,
            requestTime,
            ancillaryData,
            bondCurrency,
            reward
        );
        oo.setCustomLiveness(IDENTIFIER, requestTime, ancillaryData, liveness);

        bet.betDetails.betStatus = BetStatus.SETTLING;
        emit DataRequested(bet.affirmation, bet.negation, bet.betId);
    }

    // Settle the request once it's gone through the liveness period of 30 seconds. This acts the finalize the voted on price.
    // In a real world use of the Optimistic Oracle this should be longer to give time to disputers to catch bat price proposals.
    function settleRequest(uint256 _betId) public {
        Bet storage bet = bets[_betId];
        require(
            bet.betDetails.betStatus == BetStatus.SETTLING,
            "Bet not settling"
        );
        require(bet.affirmation == msg.sender || bet.negation == msg.sender);

        bytes memory ancillaryData = bet.betDetails.question;

        oo.settle(address(this), IDENTIFIER, requestTime, ancillaryData);
        bet.betDetails.betStatus = BetStatus.SETTLED;

        emit BetSettled(bet.affirmation, bet.negation, bet.betId);
    }

    function claimWinnings(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        uint256 totalWinnings = bet.affirmationAmount + bet.negationAmount;
        int256 settlementData = getSettledData(_betId);
        require(
            bet.betDetails.betStatus == BetStatus.SETTLED,
            "Bet not yet settled"
        );
        require(
            msg.sender == bet.affirmation || msg.sender == bet.negation,
            "This is not your bet"
        );
        require(
            settlementData == 1e18 || settlementData == 0,
            "Invalid settlement"
        );
        if (settlementData == 1e18) {
            require(msg.sender == bet.affirmation, "Negation did not win bet");
            bet.betDetails.bondCurrency.transfer(
                bet.affirmation,
                totalWinnings
            );
        } else {
            require(msg.sender == bet.negation, "Affirmation did not win bet");
            bet.betDetails.bondCurrency.transfer(bet.negation, totalWinnings);
        }

        bet.betDetails.betStatus = BetStatus.CLAIMED;

        emit WinningsClaimed(bet.betId, totalWinnings, settlementData);
    }

    function cancelBet(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        uint256 refundAmount;
        require(
            bet.betDetails.betStatus == BetStatus.LOADING ||
                bet.betDetails.betStatus == BetStatus.OPEN,
            "Bet already active"
        );
        require(msg.sender == bet.betDetails.creator, "Not bet creator");

        if (bet.betDetails.creator == bet.affirmation) {
            refundAmount = bet.affirmationAmount;
        } else {
            refundAmount = bet.negationAmount;
        }

        bet.betDetails.bondCurrency.transfer(
            bet.betDetails.creator,
            refundAmount
        );

        emit BetCanceled(
            bet.betId,
            address(bet.betDetails.bondCurrency),
            refundAmount
        );
    }

    function killBet(uint256 _betId) public nonReentrant {
        Bet storage bet = bets[_betId];
        int256 settlementData = getSettledData(_betId);
        require(
            bet.betDetails.betStatus == BetStatus.SETTLED,
            "Bet not yet settled"
        );
        require(
            msg.sender == bet.affirmation || msg.sender == bet.negation,
            "This is not your bet"
        );
        require(settlementData == 2 * 1e18, "Bet is settleable");
        bet.betDetails.bondCurrency.transfer(
            bet.affirmation,
            bet.affirmationAmount
        );
        bet.betDetails.bondCurrency.transfer(bet.negation, bet.negationAmount);

        bet.betDetails.betStatus = BetStatus.DEAD;

        emit BetKilled(bet.betId, bet.affirmationAmount, bet.negationAmount);
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
        require(bet.affirmation == msg.sender || bet.negation == msg.sender);

        return
            oo
                .getRequest(
                    address(this),
                    IDENTIFIER,
                    requestTime,
                    bet.betDetails.question
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
