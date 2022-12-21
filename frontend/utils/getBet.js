import { utils } from "ethers";

import contractConnection from "./contractConnection";
import getSymbol from "./getSymbol";

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'


const getBet = async (betId) => {
    const contract = await contractConnection(handler.address, handler.abi)
    let collateralSymbol;

    const betInfo = await contract.bets(betId)
    try {
        collateralSymbol = await getSymbol(utils.getAddress(betInfo.betDetails.bondCurrency))
    } catch { }
    if (!collateralSymbol) {
        return
    }

    const bet = {
        creator: utils.getAddress(betInfo.betDetails.creator),
        betId: utils.formatUnits(betInfo.betId, 0),
        question: utils.toUtf8String(betInfo.betDetails.question),
        betPrivacy: betInfo.betDetails.privateBet,
        expiry: utils.formatUnits(betInfo.betDetails.expiry, 0),
        imgUrl: utils.toUtf8String(betInfo.betDetails.imgUrl),
        collateral: utils.getAddress(betInfo.betDetails.bondCurrency),
        collateralSymbol: collateralSymbol,
        betStatus: utils.formatUnits(betInfo.betDetails.betStatus, 0),
        affirmation: utils.getAddress(betInfo.affirmation),
        affirmationToken: utils.getAddress(betInfo.affirmationToken),
        affirmationAmount: utils.formatEther(betInfo.affirmationAmount),
        negation: utils.getAddress(betInfo.negation),
        negationToken: utils.getAddress(betInfo.negationToken),
        negationAmount: utils.formatEther(betInfo.negationAmount)
    }

    return bet
}

export default getBet