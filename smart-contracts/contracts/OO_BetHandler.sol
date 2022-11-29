// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@uma/core/contracts/oracle/interfaces/OptimisticOracleV2Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OO_BetHandler is ReentrancyGuard {
    // Create an Optimistic oracle instance at the deployed address on Görli.
    OptimisticOracleV2Interface oo =
        OptimisticOracleV2Interface(0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884);

    uint256 requestTime = 0; // Store the request time so we can re-use it later.
    bytes32 constant IDENTIFIER = bytes32("YES_OR_NO_QUERY"); // Use the yes no idetifier to ask arbitary questions, such as the weather on a particular day.
    address constant ZERO_ADDRESS = address(0);
    // 0x0000000000000000000000000000000000000000

    struct BetInfo {
        uint256 betId;
        bytes question;
        uint256 expiry;
        IERC20 bondCurrency;
        address creator;
        bool privateBet;
        uint256 liveness;
        bytes imgUrl;
        BetStatus betStatus;
    }

    struct BetAmount {
        uint256 betId;
        address affirmation; // Address of the side of the bet that affirms the question.
        uint256 affirmationAmount; // Amount deposited into the bet by the affrimation.
        address negation; // Address of the side of the bet that negates the question.
        uint256 negationAmount; // Amount deposited into the bet by the negation.
        uint256 reward;
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
        address indexed bondCurrency,
        bytes indexed ancillaryData,
        uint256 betId
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
    mapping(uint256 => BetInfo) public betInfos; // All bets mapped by their betId
    mapping(uint256 => BetAmount) public betAmounts; // All bet amounts mapped by their betId.
    mapping(address => uint256[]) public userBets; // All bets the user is and has participated in.

    // ********* MUTATIVE FUNCTIONS *************

    function setBet(
        string calldata _question,
        address _bondCurrency,
        uint256 _liveness,
        uint256 _expiry,
        bool _privateBet,
        string calldata _imgUrl
    ) public nonReentrant {
        bytes memory ancillaryData = createQuestion(_question); // Question to ask the UMA Oracle.
        bytes memory imgUrl = bytes(_imgUrl);
        IERC20 bondCurrency = IERC20(_bondCurrency); // Use preferred token as the bond currency.

        BetInfo memory bet = BetInfo(
            betId,
            ancillaryData,
            _expiry,
            bondCurrency,
            msg.sender,
            _privateBet,
            _liveness,
            imgUrl,
            BetStatus.LOADING
        );

        // Make sure to approve this contract to spend your ERC20 externally first

        emit BetSet(msg.sender, _bondCurrency, ancillaryData, betId);

        betInfos[betId] = bet;
        userBets[msg.sender].push(betId);
        betId += 1;
    }

    function loadBet(
        uint256 _betId,
        bool _affirmation,
        uint256 _betAmount,
        uint256 _counterBetAmount,
        address _privateBetRecipient,
        uint256 _reward
    ) public nonReentrant {
        BetInfo storage betInfo = betInfos[_betId];
        require(msg.sender == betInfo.creator, "not creator");
        require(betInfo.betStatus == BetStatus.LOADING, "not loading");

        address affirmation;
        uint256 affirmationAmount;
        address negation;
        uint256 negationAmount;

        if (_affirmation == true) {
            affirmation = msg.sender;
            affirmationAmount = _betAmount;
            negationAmount = _counterBetAmount;
        } else {
            negation = msg.sender;
            negationAmount = _betAmount;
            affirmationAmount = _counterBetAmount;
        }

        if (betInfo.privateBet == true) {
            affirmation == msg.sender
                ? negation = _privateBetRecipient
                : affirmation = _privateBetRecipient;
        }

        BetAmount memory betAmount = BetAmount(
            _betId,
            affirmation,
            affirmationAmount,
            negation,
            negationAmount,
            _reward
        );

        // Make sure to approve this contract to spend your ERC20 externally first
        betInfo.bondCurrency.transferFrom(
            msg.sender,
            address(this),
            _betAmount
        );

        betAmounts[_betId] = betAmount;
        betInfo.betStatus = BetStatus.OPEN;
    }

    function takeBet(uint256 _betId) public nonReentrant {
        BetInfo storage betInfo = betInfos[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        require(msg.sender != betInfo.creator, "Can't take your own bet");
        if (betInfo.privateBet == false) {
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
        require(betInfo.betStatus == BetStatus.OPEN, "Bet not Open");

        if (betAmount.affirmation == ZERO_ADDRESS) {
            // Make sure to approve this contract to spend your ERC20 externally first
            betInfo.bondCurrency.transferFrom(
                msg.sender,
                address(this),
                betAmount.affirmationAmount
            );
            betAmount.affirmation = msg.sender;
        } else {
            // Make sure to approve this contract to spend your ERC20 externally first
            betInfo.bondCurrency.transferFrom(
                msg.sender,
                address(this),
                betAmount.negationAmount
            );
            betAmount.negation = msg.sender;
        }

        userBets[msg.sender].push(_betId);
        betInfo.betStatus = BetStatus.ACTIVE;

        emit BetTaken(msg.sender, _betId);
    }

    function requestData(uint256 _betId) public {
        BetInfo storage betInfo = betInfos[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        require(
            betInfo.betStatus == BetStatus.ACTIVE,
            "Bet not ready to be settled"
        );
        require(
            betAmount.affirmation == msg.sender ||
                betAmount.negation == msg.sender
        );

        // Set liveness for request disputes measured in seconds. Recommended time is at least 7200 (2 hours).
        // Users should increase liveness time depending on various factors such as amount of funds being handled
        // and risk of malicious acts.

        // Now, make the price request to the Optimistic oracle with preferred inputs.
        oo.requestPrice(
            IDENTIFIER,
            block.timestamp,
            betInfo.question,
            betInfo.bondCurrency,
            betAmount.reward
        );
        oo.setCustomLiveness(
            IDENTIFIER,
            block.timestamp,
            betInfo.question,
            betInfo.liveness
        );

        betInfo.betStatus = BetStatus.SETTLING;
        emit DataRequested(
            betAmount.affirmation,
            betAmount.negation,
            betAmount.betId
        );
    }

    // Settle the request once it's gone through the liveness period of 30 seconds. This acts the finalize the voted on price.
    // In a real world use of the Optimistic Oracle this should be longer to give time to disputers to catch bat price proposals.
    function settleRequest(uint256 _betId) public {
        BetInfo storage betInfo = betInfos[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        require(betInfo.betStatus == BetStatus.SETTLING, "Bet not settling");
        require(
            betAmount.affirmation == msg.sender ||
                betAmount.negation == msg.sender
        );

        oo.settle(address(this), IDENTIFIER, requestTime, betInfo.question);
        betInfo.betStatus = BetStatus.SETTLED;

        emit BetSettled(
            betAmount.affirmation,
            betAmount.negation,
            betAmount.betId
        );
    }

    function claimWinnings(uint256 _betId) public nonReentrant {
        BetInfo storage betInfo = betInfos[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        uint256 totalWinnings = betAmount.affirmationAmount +
            betAmount.negationAmount;
        int256 settlementData = getSettledData(_betId);
        require(betInfo.betStatus == BetStatus.SETTLED, "Bet not yet settled");
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
            betInfo.bondCurrency.transfer(betAmount.affirmation, totalWinnings);
        } else {
            require(
                msg.sender == betAmount.negation,
                "Affirmation did not win bet"
            );
            betInfo.bondCurrency.transfer(betAmount.negation, totalWinnings);
        }

        betInfo.betStatus = BetStatus.CLAIMED;

        emit WinningsClaimed(betInfo.betId, totalWinnings, settlementData);
    }

    function cancelBet(uint256 _betId) public nonReentrant {
        BetInfo storage betInfo = betInfos[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        uint256 refundAmount;
        require(
            betInfo.betStatus == BetStatus.LOADING ||
                betInfo.betStatus == BetStatus.OPEN,
            "Bet already active"
        );
        require(msg.sender == betInfo.creator, "Not bet creator");

        if (betInfo.creator == betAmount.affirmation) {
            refundAmount = betAmount.affirmationAmount;
        } else {
            refundAmount = betAmount.negationAmount;
        }

        betInfo.bondCurrency.transfer(betInfo.creator, refundAmount);

        emit BetCanceled(
            betInfo.betId,
            address(betInfo.bondCurrency),
            refundAmount
        );
    }

    function killBet(uint256 _betId) public nonReentrant {
        BetInfo storage betInfo = betInfos[_betId];
        BetAmount storage betAmount = betAmounts[_betId];
        int256 settlementData = getSettledData(_betId);
        require(betInfo.betStatus == BetStatus.SETTLED, "Bet not yet settled");
        require(
            msg.sender == betAmount.affirmation ||
                msg.sender == betAmount.negation,
            "This is not your bet"
        );
        require(settlementData == 2 * 1e18, "Bet is settleable");
        betInfo.bondCurrency.transfer(
            betAmount.affirmation,
            betAmount.affirmationAmount
        );
        betInfo.bondCurrency.transfer(
            betAmount.negation,
            betAmount.negationAmount
        );

        betInfo.betStatus = BetStatus.DEAD;

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
        BetInfo storage betInfo = betInfos[_betId];
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
                    betInfo.question
                )
                .resolvedPrice;
    }
}
