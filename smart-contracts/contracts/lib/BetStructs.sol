// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

struct Bet {
	uint256 betId;
	BetSpec betSpec;
	BetDetail betDetail;
	bytes imgUrl;
	bytes[] tags;
	BetStatus betStatus;
}

struct BetSpec {
	bytes ancillaryData;
	uint256 createdAt;
	uint256 liveness;
	uint256 rewardAmount;
}

struct BetDetail {
	address creator;
	address bondCurrency;
	bool privateBet;
	address affirmation;
	address affirmationToken;
	uint256 affirmationAmount;
	address negation;
	address negationToken;
	uint256 negationAmount;
}

enum BetStatus {
	OPEN,
	ACTIVE,
	SETTLING,
	SETTLED,
	CLAIMED,
	KILL_PROPOSED_AFFIRMATION,
	KILL_PROPOSED_NEGATION,
	KILLED
}

struct BetArgs {
	bytes question;
	bytes specifications;
	address bondCurrency;
	bool privateBet;
	address affirmation;
	address affirmationToken;
	uint256 affirmationAmount;
	address negation;
	address negationToken;
	uint256 negationAmount;
	uint256 liveness;
	uint256 rewardAmount;
	bytes imgUrl;
	bytes[] tags;
}
