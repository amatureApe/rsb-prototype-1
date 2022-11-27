import {
    ChakraProvider,
    Button,
    Box,
    Text,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Stack,
    Container,
    Flex,
    Wrap,
    WrapItem,
    Center,
    Divider,
    Image,
    Spacer,
    Badge
} from '@chakra-ui/react'

import Layout from '../components/layout/article'
import CardsWrap from '../components/open-bets-cards'
import Sidebar from '../components/menus-and-drawers/open-bets-sidebar'

import theme from '../lib/theme'
import { ethers, utils, BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import contractConnection from '../utils/contractConnection'
import erc20ABI from '../utils/abis/erc20ABI.json'

import rsbBetHandlerABI from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'
const rsbBetHandlerAddress = '0x996F097d2A2817f86727d2862F089857fCa70814'

const OpenBets = ({ Component, pageProps, router }) => {
    const [bets, setBets] = useState([])

    const test = { hello: 'Hello' }

    const getBet = async () => {
        const contract = await contractConnection(rsbBetHandlerAddress, rsbBetHandlerABI.abi)

        const response = await contract.bets(1)

        const bet = {
            creator: utils.getAddress(response.creator),
            betId: utils.formatUnits(response.betId, 0),
            collateral: utils.getAddress(response.bondCurrency),
            collateralSymbol: await getSymbol(utils.getAddress(response.bondCurrency)),
            question: utils.toUtf8String(response.question),
            betStatus: utils.formatUnits(response.betStatus, 0),
            affirmation: utils.getAddress(response.affirmation),
            affirmationAmount: utils.formatEther(response.affirmationAmount),
            negation: utils.getAddress(response.negation),
            negationAmount: utils.formatEther(response.negationAmount)
        }

        console.log(bet.negationAmount)

        setBets([...bets, bet])
    }

    const getSymbol = async (addr) => {
        const token = await contractConnection(addr, erc20ABI)
        const symbol = await token.symbol()
        return symbol
    }

    const handleBet = async () => {
        await getBet()
        console.log(bets)
    }

    return (
        <Layout title="Set Bet">
            <Button colorScheme="pink" onClick={handleBet}>
                Click
            </Button>
            <Container borderWidth="1px" maxW="full">
                <Text>Hello</Text>
            </Container>
            <Stack direction="row">
                <Sidebar />
                <CardsWrap bets={bets} />
            </Stack>
        </Layout >
    )
}

export default OpenBets