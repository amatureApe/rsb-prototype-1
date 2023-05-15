// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@uma/core/contracts/oracle/interfaces/OptimisticOracleV2Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Bet, BetSpec, BetDetail, BetStatus, BetArgs } from "./lib/BetStructs.sol";
import { QuestionUtils } from "./lib/QuestionUtils.sol";

contract OO_BetHandlerWIP {
	OptimisticOracleV2Interface oo = OptimisticOracleV2Interface(0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884);

	uint256 requestTime = 0; // Store the request time so we can re-use it later
	bytes32 constant IDENTIFIER = bytes32("YES_OR_NO_QUERY"); // Use the yes no idetifier to ask arbitary questions, such as the weather on a particular day.

	/*//////////////////////////////////////////////////////////////
                       EVENTS
    //////////////////////////////////////////////////////////////*/

	event BetSet(address indexed creator, uint256 indexed betId, bytes indexed ancillaryData);

	event BetTaken(address indexed taker, uint256 indexed betId);

	event DataRequested(address indexed affirmation, address indexed negation, uint256 indexed betId);

	event BetSettled(address indexed affirmation, address indexed negation, uint256 indexed betId);

	event WinningsClaimed(uint256 indexed betId, int256 indexed winner);

	event BetCanceled(uint256 indexed betId, address indexed bondCurrency, uint256 indexed refundAmount);

	event KillProposed(uint256 indexed betId, address indexed proposer);

	event Unkilled(uint256 indexed betId, address indexed proposer);

	event BetKilled(uint256 indexed betId, address indexed proposer, address indexed accepter);

	/*//////////////////////////////////////////////////////////////
                       DATA
    //////////////////////////////////////////////////////////////*/

	uint256 public betId = 0; // latest global betId for all managed bets.
	mapping(uint256 => Bet) public bets; // All bets mapped by their betId
	mapping(bytes => uint256) public hashIds; // A hash of bet question, msg.sender, and timestamp to betId
	mapping(address => uint256[]) public userBets; // All bets the user is and has participated in.

	/*//////////////////////////////////////////////////////////////
                       PRIMARY MUTATIVE LOGIC
    //////////////////////////////////////////////////////////////*/

	error InvalidParticipants(address affirmation, address negation);
	error PrivateBet(address affirmation, address negation);

	function setBet(BetArgs memory betArgs) internal {
		if (betArgs.affirmation == betArgs.negation) {
			revert InvalidParticipants(betArgs.affirmation, betArgs.negation);
		}

		if (betArgs.privateBet == true) {
			if (betArgs.affirmation == address(0) || betArgs.negation == address(0)) {
				revert PrivateBet(betArgs.affirmation, betArgs.negation);
			}
		} else {
			if (betArgs.affirmation != address(0) && betArgs.negation != address(0)) {
				revert PrivateBet(betArgs.affirmation, betArgs.negation);
			}
		}

		uint256 _betId = betId;

		bytes memory ancillaryData = QuestionUtils.createAncillaryData(betArgs.question, betArgs.specifications);

		BetSpec memory betSpec = BetSpec(ancillaryData, block.timestamp, betArgs.liveness, betArgs.rewardAmount);

		BetDetail memory betDetail = BetDetail(
			msg.sender,
			betArgs.bondCurrency,
			betArgs.privateBet,
			betArgs.affirmation,
			betArgs.affirmationToken,
			betArgs.affirmationAmount,
			betArgs.negation,
			betArgs.negationToken,
			betArgs.negationAmount
		);

		Bet memory bet = Bet(_betId, betSpec, betDetail, betArgs.imgUrl, betArgs.tags, BetStatus.OPEN);

		bytes memory hashId = abi.encode(ancillaryData, msg.sender, block.timestamp);

		bets[_betId] = bet;
		hashIds[hashId] = _betId;
		userBets[msg.sender].push(_betId);
		++betId;
	}

	error BetNotOpen(uint256 betId);
	error CantTakeOwnBet(uint256 betId, address creator, address taker);

	function takeBet(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;

		if (bet.betStatus != BetStatus.OPEN) {
			revert BetNotOpen(_betId);
		}

		if (betDetail.creator == msg.sender) {
			revert CantTakeOwnBet(_betId, betDetail.creator, msg.sender);
		}

		if (betDetail.privateBet == false) {
			if (betDetail.affirmation == address(0)) {
				IERC20 token = IERC20(betDetail.affirmationToken);

				token.transferFrom(msg.sender, address(this), betDetail.affirmationAmount);

				bet.betDetail.affirmation = msg.sender;
			} else {
				IERC20 token = IERC20(betDetail.negationToken);

				token.transferFrom(msg.sender, address(this), betDetail.negationAmount);

				bet.betDetail.negation = msg.sender;
			}
		} else {
			if (betDetail.affirmation == msg.sender) {
				IERC20 token = IERC20(betDetail.affirmationToken);

				token.transferFrom(msg.sender, address(this), betDetail.affirmationAmount);
			} else {
				IERC20 token = IERC20(betDetail.negationToken);

				token.transferFrom(msg.sender, address(this), betDetail.negationAmount);
			}
		}

		userBets[msg.sender].push(_betId);
		bet.betStatus = BetStatus.ACTIVE;

		emit BetTaken(msg.sender, _betId);
	}

	error BetNotReadyToSettle(uint256 betId);

	function requestData(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;
		BetSpec memory betSpec = bet.betSpec;

		if (bet.betStatus != BetStatus.ACTIVE) {
			revert BetNotReadyToSettle(_betId);
		}

		IERC20 bondCurrency = IERC20(betDetail.bondCurrency);

		oo.requestPrice(IDENTIFIER, requestTime, betSpec.ancillaryData, bondCurrency, betSpec.rewardAmount);
		oo.setCustomLiveness(IDENTIFIER, requestTime, betSpec.ancillaryData, betSpec.liveness);

		bet.betStatus = BetStatus.SETTLING;

		emit DataRequested(betDetail.affirmation, betDetail.negation, _betId);
	}

	error BetNotSettling(uint256 betId);

	function settleRequest(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;
		BetSpec memory betSpec = bet.betSpec;

		if (bet.betStatus != BetStatus.SETTLING) {
			revert BetNotSettling(_betId);
		}

		oo.settle(address(this), IDENTIFIER, requestTime, betSpec.ancillaryData);

		bet.betStatus = BetStatus.SETTLED;

		emit BetSettled(betDetail.affirmation, betDetail.negation, _betId);
	}

	function distributeWinnings(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;

		int256 settlementData = getSettledData(_betId);

		IERC20 affirmationToken = IERC20(betDetail.affirmationToken);
		address affirmation = betDetail.affirmation;

		IERC20 negationToken = IERC20(betDetail.negationToken);
		address negation = betDetail.negation;

		if (settlementData == 1e18) {
			affirmationToken.transfer(affirmation, betDetail.affirmationAmount);
			negationToken.transfer(affirmation, betDetail.negationAmount);
		} else if (settlementData == 0) {
			affirmationToken.transfer(negation, betDetail.affirmationAmount);
			negationToken.transfer(negation, betDetail.negationAmount);
		} else {
			affirmationToken.transfer(affirmation, betDetail.affirmationAmount);
			negationToken.transfer(negation, betDetail.negationAmount);
		}

		bet.betStatus = BetStatus.CLAIMED;

		emit WinningsClaimed(bet.betId, settlementData);
	}

	/*//////////////////////////////////////////////////////////////
                       SECONDARY MUTATIVE LOGIC
    //////////////////////////////////////////////////////////////*/

	function cancelBet(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;

		uint256 refundAmount;

		if (betDetail.creator == betDetail.affirmation) {
			refundAmount = betDetail.affirmationAmount;
		} else {
			refundAmount = betDetail.negationAmount;
		}

		IERC20(betDetail.bondCurrency).transfer(betDetail.creator, refundAmount);

		emit BetCanceled(bet.betId, betDetail.bondCurrency, refundAmount);
	}

	error InvalidProposeKill(uint256 betId, address affirmation, address negation, address sender);
	error BetMustBeActive(uint256 betId);

	function proposeKill(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;

		if (bet.betStatus != BetStatus.ACTIVE) {
			revert BetMustBeActive(_betId);
		}

		if (betDetail.affirmation != msg.sender && betDetail.negation != msg.sender) {
			revert InvalidProposeKill(_betId, betDetail.affirmation, betDetail.negation, msg.sender);
		}

		if (betDetail.affirmation == msg.sender) {
			bet.betStatus = BetStatus.KILL_PROPOSED_AFFIRMATION;
		} else {
			bet.betStatus = BetStatus.KILL_PROPOSED_NEGATION;
		}

		emit KillProposed(_betId, msg.sender);
	}

	error KillMustBeProposed(uint256 betId);
	error CantUnKill(uint256 betId, address sender);

	function unKill(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;

		if (bet.betStatus != BetStatus.KILL_PROPOSED_AFFIRMATION && bet.betStatus != BetStatus.KILL_PROPOSED_NEGATION) {
			revert KillMustBeProposed(_betId);
		}

		if (bet.betStatus == BetStatus.KILL_PROPOSED_AFFIRMATION) {
			if (betDetail.affirmation == msg.sender) {
				bet.betStatus = BetStatus.ACTIVE;
			} else {
				revert CantUnKill(_betId, msg.sender);
			}
		} else {
			if (betDetail.negation == msg.sender) {
				bet.betStatus = BetStatus.ACTIVE;
			} else {
				revert CantUnKill(_betId, msg.sender);
			}
		}

		emit Unkilled(_betId, msg.sender);
	}

	error CantAcceptKill(uint256 betId, address sender);

	function acceptKill(uint256 _betId) public {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;

		if (bet.betStatus != BetStatus.KILL_PROPOSED_AFFIRMATION && bet.betStatus != BetStatus.KILL_PROPOSED_NEGATION) {
			revert KillMustBeProposed(_betId);
		}

		if (bet.betStatus == BetStatus.KILL_PROPOSED_AFFIRMATION) {
			if (betDetail.negation == msg.sender) {
				IERC20 affirmationToken = IERC20(betDetail.affirmationToken);
				IERC20 negationToken = IERC20(betDetail.negationToken);

				affirmationToken.transfer(betDetail.affirmation, bet.betDetail.affirmationAmount);

				negationToken.transfer(msg.sender, bet.betDetail.negationAmount);

				bet.betStatus = BetStatus.KILLED;

				emit BetKilled(_betId, betDetail.affirmation, msg.sender);
			} else {
				revert CantAcceptKill(_betId, msg.sender);
			}
		} else {
			if (betDetail.affirmation == msg.sender) {
				IERC20 affirmationToken = IERC20(betDetail.affirmationToken);
				IERC20 negationToken = IERC20(betDetail.negationToken);

				affirmationToken.transfer(msg.sender, betDetail.affirmationAmount);

				negationToken.transfer(betDetail.negation, betDetail.negationAmount);

				bet.betStatus = BetStatus.KILLED;

				emit BetKilled(_betId, betDetail.negation, msg.sender);
			} else {
				revert CantAcceptKill(_betId, msg.sender);
			}
		}
	}

	/*//////////////////////////////////////////////////////////////
                       VIEW LOGIC
    //////////////////////////////////////////////////////////////*/

	// Fetch the resolved price from the Optimistic Oracle that was settled.
	function getSettledData(uint256 _betId) public view returns (int256) {
		Bet storage bet = bets[_betId];
		BetDetail memory betDetail = bet.betDetail;
		BetSpec memory betSpec = bet.betSpec;

		require(betDetail.affirmation == msg.sender || betDetail.negation == msg.sender);

		return oo.getRequest(address(this), IDENTIFIER, requestTime, betSpec.ancillaryData).resolvedPrice;
	}
}
