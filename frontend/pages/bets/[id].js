import { useEffect, useState } from "react"
import { ethers, utils, BigNumber } from 'ethers'
import {
    Box,
    Stack,
    Text,
    Heading,
    Image,
    Spacer,
    Container,
    Flex,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Badge,
    useColorModeValue
} from '@chakra-ui/react'

import { ChevronDownIcon } from "@chakra-ui/icons"

import contractConnection from "../../utils/contractConnection"
import getBet from "../../utils/getBet"
import { BET_STATUS } from "../../consts"

import handler from '../../../smart-contracts/deployments/goerli/OO_BetHandler.json'


const Details = ({ accounts, id }) => {
    const [bet, setBet] = useState([])
    let contract

    if (typeof window !== "undefined") {
        const getContract = async () => {
            contract = await contractConnection(handler.address, handler.abi)
        }

        (async () => await getContract())()
    }

    const handleBet = async () => {
        const response = await getBet(id)
        setBet(response)
    }

    useEffect(() => {
        handleBet()
    }, [])


    return (
        <Container maxW='75%'>
            <Flex mb={5}>
                <Spacer />
                <Heading>Bet Details</Heading>
                <Spacer />
            </Flex>
            <Stack direction="row" justify="center">
                <Stack borderWidth="1px" borderColor="#FF4993" borderRadius={10} p={5}>
                    <Image src={bet.imgUrl} />
                    <Text>{bet.imgUrl?.slice(0, 30) + '...' + bet.imgUrl?.slice(-10)}</Text>
                    <Stack direction="row" justify="center">
                        {
                            (() => {
                                switch (bet.betStatus) {
                                    case '0':
                                        return <Button>Load Bet</Button>
                                    case '1':
                                        return <Button>Buy</Button>
                                    case '2':
                                        return <Button>Validate</Button>
                                    case '3':
                                        return <Button>Settle</Button>
                                    case '4':
                                        return <Button>Claim</Button>
                                    case '5':
                                        return <Heading>Claimed!</Heading>
                                    case '6':
                                        return <Heading>Dead</Heading>
                                    default:
                                        return <Heading>Loading</Heading>
                                }
                            })()
                        }
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                Actions
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Change Image</MenuItem>
                                <MenuItem>Cancel Bet</MenuItem>
                                <MenuItem>Kill Bet</MenuItem>
                            </MenuList>
                        </Menu>
                    </Stack>
                </Stack>
                <Box minW={750} borderWidth="1px" borderColor="#FF4993" borderRadius={10} p={5}>
                    <Stack direction="row" justify="center" mb={2}>
                        <Heading color="#FF4993" fontSize={24}>ID: {id}</Heading>
                    </Stack>
                    <Stack bg="rgba(255, 73, 147, 0.2)" borderRadius={10} p={5}>
                        <Flex direction="row" justify="space-between" align="center">
                            <Badge colorScheme={BET_STATUS[bet.betStatus]?.color} px={2} mb={1} variant={useColorModeValue("solid", "subtle")}><Text fontSize={24}>{BET_STATUS[bet.betStatus]?.status}</Text></Badge>
                            <Spacer />
                            <Heading fontSize={24}>
                                {
                                    (() => {
                                        if (accounts[0] && bet.creator) {
                                            if (utils.getAddress(bet.creator) == utils.getAddress(accounts[0])) {
                                                return "You are the Creator"
                                            }
                                            else if (utils.getAddress(accounts[0] === bet.affirmation) || utils.getAddress(accounts[0] === bet.negation)) {
                                                return "You are a Participant"
                                            } else {
                                                return null
                                            }
                                        }
                                    })()
                                }
                            </Heading>
                            <Spacer />
                            <Spacer />
                        </Flex>
                        <Text fontSize={24}>{bet.question}</Text>
                        <Stack spacing={0} py={6}>
                            <Heading fontSize={24}>Info</Heading>
                            <Text fontSize={20}>
                                Bet Privacy: {
                                    bet.betPrivacy?.toString() === false ?
                                        "Public" : "Private"
                                }
                            </Text>
                            <Text fontSize={20}>Collateral: {bet.collateral}</Text>
                            <Text fontSize={20}>Expiry: {bet.expiry}</Text>
                            <Text fontSize={20}>Creator: {bet.creator}</Text>
                        </Stack>
                        <Stack spacing={0}>
                            <Heading fontSize={24}>Affirmation</Heading>
                            <Text fontSize={20}>Affirmation: {bet.affirmation}</Text>
                            <Text fontSize={20}>Affirmation Token: {bet.affirmationToken}</Text>
                            <Text fontSize={20}>Affirmation Amount: {bet.affirmationAmount}</Text>
                        </Stack>
                        <Stack spacing={0}>
                            <Heading fontSize={24}>Negation</Heading>
                            <Text fontSize={20}>Negation: {bet.negation}</Text>
                            <Text fontSize={20}>Negation Token: {bet.negationToken}</Text>
                            <Text fontSize={20}>Negation Amount: {bet.negationAmount}</Text>
                        </Stack>
                    </Stack>
                    <Stack direction="row" justify="center" mt={10}>
                        <Heading fontSize={24}>Bet Details</Heading>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params

    return {
        props: {
            id
        }
    }

}

export default Details