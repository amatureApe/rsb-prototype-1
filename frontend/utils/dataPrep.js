import { ethers, BigNumber, utils } from 'ethers'
const Web3 = require('web3')
const web3 = new Web3(Web3.givenProvider)

import { ZERO_ADDRESS } from '../consts'


export const prepareSetBet = (
    question,
    expiry,
    bond,
    livenessPeriod,
    validationReward,
    betPrivacy,
    imgUrl
) => {
    const data = [
        web3.utils.asciiToHex(question),
        expiry,
        bond,
        BigNumber.from(livenessPeriod),
        utils.parseEther(validationReward),
        betPrivacy === '1' ? false : true,
        web3.utils.asciiToHex(imgUrl)
    ]

    return data
}

export const prepareLoadBet = (
    betId,
    betSide,
    accounts,
    betPrivacy,
    affirmation,
    affirmationCollateral,
    affirmationAmount,
    negation,
    negationCollateral,
    negationAmount
) => {
    try {

    } catch (err) {
        console.log("error: ", err)
    }

    const data = [
        betId,
        betPrivacy === '1' ? (betSide === '1' ? accounts[0] : ZERO_ADDRESS) : (betSide === '1' ? ZERO_ADDRESS : affirmation),
        affirmationCollateral,
        utils.parseUnits(affirmationAmount, 18),
        betPrivacy === '1' ? (betSide === '1' ? ZERO_ADDRESS : accounts[0]) : (betSide === '1' ? negation : ZERO_ADDRESS),
        negationCollateral,
        utils.parseUnits(negationAmount, 18)
    ]

    return data
}