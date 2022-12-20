import contractConnection from "./contractConnection"
import erc20ABI from './abis/erc20ABI.json'

const getSymbol = async (addr) => {
    const token = await contractConnection(addr, erc20ABI)
    const symbol = await token.symbol()
    return symbol
}

export default getSymbol