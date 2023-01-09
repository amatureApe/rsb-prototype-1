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
    Link,
    Divider,
    useColorModeValue,
    useToast
} from '@chakra-ui/react'

import { ChevronDownIcon, StarIcon } from "@chakra-ui/icons"

import contractConnection from "../../utils/contractConnection"
import getBet from "../../utils/getBet"
import { BET_STATUS, ZERO_ADDRESS } from "../../consts"
import { PendingStyle, SuccessStyle, ErrorStyle } from "../../styles/toastStyles"

import handler from '../../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const OpenPosition = () => {
    return (
        <Stack direction="row" align="center" mb={1}>
            <Text fontSize={20}>Address:</Text>
            <Badge fontSize={18} colorScheme="green" variant={useColorModeValue("solid", "subtle")}>Open Position</Badge>
        </Stack>
    )
}

const Details = ({ accounts, id }) => {
    const [bet, setBet] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    let contract

    const Toast = useToast()

    if (typeof window !== "undefined") {
        const getContract = async () => {
            contract = await contractConnection(handler.address, handler.abi)
        }

        (async () => await getContract())()
    }

    const handleBet = async () => {
        const response = await getBet(id)
        setBet(response)
        setIsLoaded(true)
    }

    useEffect(() => {
        handleBet()
    }, [])

    const handleBuy = async () => {
        try {
            const tx = await contract.takeBet(bet.betId)
            Toast(PendingStyle)

            await tx.wait()
            Toast(SuccessStyle)

            handleBet()
        } catch (error) {
            Toast(ErrorStyle(error))
        }
    }

    return (
        <Container maxW='75%'>
            {isLoaded ? (
                <Box>
                    <Flex mb={5}>
                        <Spacer />
                        <Heading>Bet Details</Heading>
                        <Spacer />
                    </Flex>
                    <Stack >
                        <Stack direction="row" justify="center" mb={2}>
                            <Heading color="#FF4993" fontSize={24}>ID: {id}</Heading>
                        </Stack>
                        <Stack direction="row" justify="center" >
                            <Stack borderRadius={10} p={5}>
                                <Image src={bet.imgUrl} maxW={500} borderRadius={10} />
                                <Text>{bet.imgUrl?.slice(0, 30) + '...' + bet.imgUrl?.slice(-10)}</Text>
                                <Stack direction="row" justify="center">
                                    {
                                        (() => {
                                            switch (bet.betStatus) {
                                                case '0':
                                                    if (accounts[0] === bet.creator) {
                                                        return <Button>Load Bet</Button>
                                                    }
                                                    else {
                                                        return <Button>Loading</Button>
                                                    }
                                                case '1':
                                                    return <Button onClick={handleBuy}>Buy</Button>
                                                case '2':
                                                    return <Button>Validate</Button>
                                                case '3':
                                                    return <Button>Settle</Button>
                                                case '4':
                                                    return <Button>Claim</Button>
                                                case '5':
                                                    return <Button>Claimed!</Button>
                                                case '6':
                                                    return <Button>Dead</Button>
                                                default:
                                                    return <Button>Loading</Button>
                                            }
                                        })()
                                    }
                                    <Menu>
                                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                            Manage
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem>Change Image</MenuItem>
                                            <MenuItem>Cancel Bet</MenuItem>
                                            <MenuItem>Kill Bet</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Stack>
                            </Stack>
                            <Box borderRadius={10} p={5}>
                                {/* <Stack direction="row" justify="center" mb={2}>
                                    <Heading color="#FF4993" fontSize={24}>ID: {id}</Heading>
                                </Stack> */}
                                <Stack bg="rgba(255, 73, 147, 0.2)" borderRadius={10} p={5}>
                                    <Flex direction="row" justify="space-between" align="center">
                                        <Badge colorScheme={BET_STATUS[bet.betStatus]?.color} px={2} mb={1} variant={useColorModeValue("solid", "subtle")}><Text fontSize={24}>{BET_STATUS[bet.betStatus]?.status}</Text></Badge>
                                        <Spacer />
                                        <Heading fontSize={24}>
                                            {
                                                (() => {
                                                    if (accounts[0] && bet.creator) {
                                                        if (bet.creator == accounts[0]) {
                                                            return "You are the Creator"
                                                        }
                                                        else if (accounts[0] === bet.affirmation || accounts[0] === bet.negation) {
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
                                    <Divider />
                                    <Stack spacing={0} py={6}>
                                        <Heading fontSize={24}>Info</Heading>
                                        <Text fontSize={20}>Creator: <Link href={`https://goerli.etherscan.io/address/${bet.creator}`} isExternal>{bet.creator}</Link></Text>
                                        <Text fontSize={20}>Collateral: <Link href={`https://goerli.etherscan.io/address/${bet.collateral}`} isExternal>{bet.collateral}</Link></Text>
                                        <Text fontSize={20}>Expiry: {bet.expiry}</Text>
                                        <Text fontSize={20}>
                                            Bet Privacy: {
                                                bet.betPrivacy?.toString() === false ?
                                                    "Public" : "Private"
                                            }
                                        </Text>
                                    </Stack>
                                    <Stack spacing={0}>
                                        <Heading fontSize={24}>Affirmation</Heading>
                                        {bet.affirmation === ZERO_ADDRESS ? <OpenPosition position="Affirmation" /> : <Text fontSize={20}>Address: <Link href={`https://goerli.etherscan.io/address/${bet.affirmation}`} isExternal>{bet.affirmation}</Link></Text>}
                                        <Text fontSize={20}>Token: <Link href={`https://goerli.etherscan.io/address/${bet.affirmationToken}`} isExternal>{bet.affirmationToken}</Link></Text>
                                        <Text fontSize={20}>Amount: {bet.affirmationAmount}</Text>
                                    </Stack>
                                    <Stack spacing={0}>
                                        <Heading fontSize={24}>Negation</Heading>
                                        {bet.negation === ZERO_ADDRESS ? <OpenPosition position="Negation" /> : <Text fontSize={20}>Address: <Link href={`https://goerli.etherscan.io/address/${bet.negation}`} isExternal>{bet.negation}</Link></Text>}
                                        <Text fontSize={20}>Token: <Link href={`https://goerli.etherscan.io/address/${bet.negationToken}`} isExternal>{bet.negationToken}</Link></Text>
                                        <Text fontSize={20}>Amount: {bet.negationAmount}</Text>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                        {bet.specifications.length > 1 ?
                            <Box>
                                <Stack direction="row" justify="center" mt={10}>
                                    <Heading color="#FF4993" fontSize={24}>Bet Specifications</Heading>
                                </Stack>
                                <Text fontSize={20}>{bet.specifications}</Text>
                            </Box>
                            :
                            <Box></Box>
                        }
                    </Stack>
                </Box>
            ) : (
                <Stack direction="row" justify="center">
                    <Heading>LOADING BET...</Heading>
                </Stack>
            )
            }
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