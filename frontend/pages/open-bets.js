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
    Spacer
} from '@chakra-ui/react'
import Layout from '../components/layout/main'
import theme from '../lib/theme'
import { ethers, utils, BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import contractConnection from '../utils/contractConnection'

import rsbBetHandlerABI from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'
const rsbBetHandlerAddress = '0x996F097d2A2817f86727d2862F089857fCa70814'

const OpenBets = ({ Component, pageProps, router }) => {
    const [bets, setBets] = useState([])

    const getBet = async () => {
        const contract = await contractConnection(rsbBetHandlerAddress, rsbBetHandlerABI)

        const bet = await contract.bets(1)
        console.log(bet)
        setBets([...bets, bet])
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
                        const creator = utils.getAddress(bet.creator)
                        const question = utils.toUtf8String(bet.question)
                        const affirmation = utils.getAddress(bet.affirmation)
                        const negation = utils.getAddress(bet.negation)
                        return (
                            <WrapItem>
                                <Center w='300px'>
                                    <Card>
                                        <CardHeader>
                                            <Stack direction="row" justify="space-between">
                                                <Stack direction="row">
                                                    <Heading fontSize="14px">Id: {utils.formatUnits(bet.betId, 0)}</Heading>
                                                    <Heading fontSize="14px">Status: {utils.formatUnits(bet.betStatus, 0)}</Heading>
                                                </Stack>
                                                <Flex direction="row" justify="center" align="center">
                                                    <Text fontSize="12px">Creator: {creator.slice(0, 4) + '...' + creator.slice(-4)}</Text>
                                                </Flex>
                                            </Stack>
                                            <Divider mb={-10} />
                                        </CardHeader>
                                        <CardBody>
                                            <Box>
                                                <Heading fontSize="14px">Bet:</Heading>
                                                <Text fontSize="14px" noOfLines={3}>{question}</Text>
                                            </Box>
                                            <Spacer mb={5} />
                                            <Text>Bet Size: </Text>
                                            <Text>Counterbet: </Text>
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