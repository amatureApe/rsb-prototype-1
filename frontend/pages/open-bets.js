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
    Image,
    Spacer,
    Badge
} from '@chakra-ui/react'
import Layout from '../components/layout/article'
import theme from '../lib/theme'
import { ethers, utils, BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import contractConnection from '../utils/contractConnection'
import getRatio from '../utils/getRatio'

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
            <Box>
                <Wrap>
                    {bets.map((bet) => {
                        const creatorPosition = bet.creator === bet.affirmation ? 'Aff' : 'Neg'
                        const openPosition = bet.creator === bet.affirmation ?
                            <Badge colorScheme='red' mb={1}>Negation</Badge> :
                            <Badge colorScheme='green'>Affirmation</Badge>
                        const odds = bet.creator == bet.affirmation ?
                            <Badge colorScheme="pink" py={1}><Badge colorScheme="pink" py={1}><Text>{getRatio(bet.negationAmount, bet.affirmationAmount, 0.05)}</Text></Badge></Badge> :
                            <Badge colorScheme="green" py={1}><Badge colorScheme="green" py={1}><Text>{getRatio(bet.affirmationAmount, bet.negationAmount, 0.05)}</Text></Badge></Badge>
                        return (
                            <WrapItem>
                                <Center maxW={400}>
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
                                            <Stack direction="row">
                                                <Image src="https://bit.ly/dan-abramov" boxSize="100px"></Image>
                                                <Stack direciton="row" justify="space-between">
                                                    <Text fontSize="14px" noOfLines={3}>{bet.question.slice(2, -54)}

                                                    </Text>
                                                    <Text fontSize="12px">Expires At:</Text>
                                                </Stack>
                                            </Stack>
                                            <Divider mt={3} mb={2} />
                                            <Stack direction="row" justify="space-between">
                                                <Stack direction="column" spacing={0.5}>
                                                    <Stack>
                                                        <Badge fontSize="10px" colorScheme="green">
                                                            <Flex>
                                                                <Text>Affirmation: </Text>
                                                                <Spacer px={2} />
                                                                <Text>{bet.affirmationAmount} {bet.collateralSymbol}</Text>
                                                            </Flex>
                                                        </Badge>
                                                    </Stack>
                                                    <Stack>
                                                        <Badge fontSize="10px" colorScheme="red">
                                                            <Flex>
                                                                <Text>Negation: </Text>
                                                                <Spacer px={2} />
                                                                <Text>{bet.negationAmount} {bet.collateralSymbol}</Text>
                                                            </Flex>
                                                        </Badge>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" align="center" justify="center">
                                                    {odds}
                                                </Stack>
                                                <Stack justify="center" align="center">
                                                    <Button h="24px" bg="#FF4993">Buy</Button>
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
        </Layout >
    )
}

export default OpenBets