import { ChakraProvider, Button } from '@chakra-ui/react'
import Layout from '../components/layout/main'
import theme from '../lib/theme'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import contractConnection from '../utils/contractConnection'

import rsbBetHandlerABI from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'
const rsbBetHandlerAddress = '0x996F097d2A2817f86727d2862F089857fCa70814'

const OpenBets = ({ Component, pageProps, router }) => {
    const [count, setCount] = useState(0)

    const getBet = async () => {
        const contract = await contractConnection(rsbBetHandlerAddress, rsbBetHandlerABI)

        const bet = await contract.bets(1)
        console.log(bet)
    }

    const handleBet = async () => {
        getBet()
    }

    useEffect(() => {
        console.log(`You've clicked ${count} times`)
    })


    return (
        <div>
            <Button colorScheme="pink" onClick={handleBet}>
                Click
            </Button>
        </div>
    )
}

export default OpenBets