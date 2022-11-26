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
    Flex,
    Wrap,
    WrapItem,
    Center,
    Divider,
    Spacer,
    Badge
} from '@chakra-ui/react'
import Layout from '../components/layout/main'
import theme from '../lib/theme'
import { ethers, utils, BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import contractConnection from '../utils/contractConnection'

import erc20ABI from '../../smart-contracts/contracts/abis/erc20ABI.json'

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
            negation: utils.getAddress(response.negation),
        }

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
        <div>
            <Button colorScheme="pink" onClick={handleBet}>
                Click
            </Button>
            <Box>
                <Wrap>
                    {bets.map((bet) => {
                        const creatorPosition = bet.creator === bet.affirmation ? 'Aff' : 'Neg'
                        const openPosition = bet.creator === bet.affirmation ?
                            <Badge colorScheme='red'>Negation</Badge> :
                            <Badge colorScheme='green'>Affirmation</Badge>
                        return (
                            <WrapItem>
                                <Center w='400px'>
                                    <Card>
                                        <CardHeader>
                                            <Stack direction="row" justify="space-between">
                                                <Stack direction="row">
                                                    <Heading fontSize="14px">Id: {bet.betId}</Heading>
                                                    <Heading fontSize="14px">Status: {bet.betStatus}</Heading>
                                                </Stack>
                                                <Flex direction="row" justify="center" align="center">
                                                    <Text fontSize="12px">Position: {openPosition}</Text>
                                                </Flex>
                                            </Stack>
                                            <Divider mb={-10} />
                                        </CardHeader>
                                        <CardBody>
                                            <Box>
                                                <Text fontSize="14px" noOfLines={3}>{bet.question}</Text>
                                            </Box>
                                            <Divider mt={5} mb={1} />
                                            <Stack direction="row" justify="space-between">
                                                <Stack direction="column" spacing={0.5}>
                                                    <Stack>
                                                        <Badge fontSize="10px" colorScheme="green">Affirmation: 100000000000000000 {bet.collateralSymbol}</Badge>
                                                    </Stack>
                                                    <Stack>
                                                        <Badge fontSize="10px" colorScheme="red">Negation: </Badge>
                                                    </Stack>
                                                </Stack>
                                                <Stack justify="center" align="center">
                                                    <Button h="24px" bg="#FF4993">Bet</Button>
                                                </Stack>
                                            </Stack>
                                        </CardBody>
                                    </Card>
                                </Center>
                            </WrapItem>
                        )
                    })}
                </Wrap>
            </Box>
        </div >
    )
}

export default OpenBets