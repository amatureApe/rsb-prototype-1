import { ethers } from 'ethers'
import erc20ABI from '../utils/abis/erc20ABI.json'
import contractConnection from './contractConnection'

export const checkApproval = async (token, spender, accounts) => {
    const contract = await contractConnection(token, erc20ABI)
    const allowance = await contract.allowance(accounts[0], spender)
    if (allowance <= 0) {
        return false
    }
    return true
}

export const approve = async (token, spender) => {
    const contract = await contractConnection(token, erc20ABI)
    const approvalTx = await contract.approve(spender, ethers.constants.MaxUint256)
    await approvalTx.wait()
}
