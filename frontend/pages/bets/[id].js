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
    Spinner,
    useColorModeValue,
    useToast,
    ToastProvider
} from '@chakra-ui/react'

import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons"

import { LeapFrog } from '@uiball/loaders'

import contractConnection from "../../utils/contractConnection"
import getBet from "../../utils/getBet"
import { BET_STATUS, ZERO_ADDRESS } from "../../consts"

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

    const toast = useToast()

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

    const customToast = (heading, message, type) => {
        const id = toast({
            position: 'top-left',
            duration: type === 'success' ? 10000 : null,
            render: function renderToast() {
                return (
                    <Box borderRadius={10} borderWidth='3px' borderColor={useColorModeValue('blackAlpha.700', '#FF4993')} p={1}>
                        <Box bg={useColorModeValue('#f0e7db', '#202023')} borderRadius={10}>
                            <Stack bg={useColorModeValue('rgba(255, 73, 147, 0.9)', 'rgba(255, 73, 147, 0.3)')} p={3} borderRadius={10}>
                                <Stack direction="row" justify="space-between">
                                    {
                                        type === 'pending' ?
                                            (
                                                <Stack direction="row">
                                                    <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>
                                                    <LeapFrog size={30} color='white' />
                                                </Stack>
                                            ) : (
                                                <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>

                                            )}
                                    <Button size="xs" variant="ghost" onClick={() => toast.close(id)}> <CloseIcon /></Button>
                                </Stack>
                                <Text color='whiteAlpha.900'>{message}</Text>
                            </Stack>
                        </Box>
                    </Box >
                )
            }
        })

        return id
    }

    const updateToast = (id, heading, message, type) => {
        if (toast.isActive(id)) {
            toast.update(id, {
                duration: type === 'success' ? 10000 : null,
                render: function renderToast() {
                    return (
                        <Box borderRadius={10} borderWidth='3px' borderColor={useColorModeValue('blackAlpha.700', '#FF4993')} p={1}>
                            <Box bg={useColorModeValue('#f0e7db', '#202023')} borderRadius={10}>
                                <Stack bg={useColorModeValue('rgba(255, 73, 147, 0.9)', 'rgba(255, 73, 147, 0.3)')} p={3} borderRadius={10}>
                                    <Stack direction="row" justify="space-between">
                                        {
                                            type === 'pending' ?
                                                (
                                                    <Stack direction="row">
                                                        <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>
                                                        <LeapFrog size={30} color='white' />
                                                    </Stack>
                                                ) : (
                                                    <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>

                                                )}
                                        <Button size="xs" variant="ghost" onClick={() => toast.close(id)}> <CloseIcon /></Button>
                                    </Stack>
                                    <Text color='whiteAlpha.900'>{message}</Text>
                                </Stack>
                            </Box>
                        </Box >
                    )
                }
            })
        }
        else {
            customToast(heading, message, type)
        }
    }

    const handleBuy = async () => {
        try {
            const tx = await contract.takeBet(bet.betId)
            const id = customToast('Pending!', 'Transaction is being confirmed', 'pending')

            await tx.wait()
            updateToast(id, 'Success!', 'Transaction has been confirmed', 'success')

            handleBet()
        } catch (error) {
            customToast('Error!', error.message.toString(), 'error')
        }
    }

    const handleValidate = async () => {
        try {
            const tx = await contract.requestData(bet.betId)
            const id = customToast('Pending!', 'Transaction is being confirmed', 'pending')

            await tx.wait()
            updateToast(id, 'Success!', 'Transaction has been confirmed', 'success')

            handleBet()
        } catch (err) {
            customToast('Error!', err.message.toString(), 'error')
        }
    }

    const handleSettle = async () => {
        try {
            const tx = await contract.settleRequest(bet.betId)
            const id = customToast('Pending!', 'Transaction is being confirmed', 'pending')

            await tx.wait()
            updateToast(id, 'Success!', 'Transaction has been confirmed', 'success')

            handleBet()
        } catch (error) {
            customToast('Error!', error.message.toString(), 'error')
        }
    }

    const handleClaim = async () => {
        try {
            const tx = await contract.claimWinnings(bet.betId)
            const id = customToast('Pending!', 'Transaction is being confirmed', 'pending')

            await tx.wait()
            updateToast(id, 'Success!', 'Transaction has been confirmed', 'success')

            handleBet()
        } catch (error) {
            customToast('Error!', error.message.toString(), 'error')
        }
    }

    const handleAlreadyClaimed = async () => {
        customToast('Already Claimed!', 'The winnings for this bet have already been claimed', 'error')
    }

    const handleDead = () => {
        customToast('Bet is Dead!', 'Bet was either returned as unsettleable or canceled by owner', 'error')

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
                    <Stack>
                        <Stack direction="row" justify="center" mb={2}>
                            <Heading color="#FF4993" fontSize={24}>ID: {id}</Heading>
                        </Stack>
                        <Stack direction="row" justify="center">
                            <Box borderRadius={10} p={2}>
                                <Stack bg="rgba(255, 73, 147, 0.2)" borderRadius={10} p={5}>
                                    {
                                        bet.imgUrl === './images/rsb-icon-pink-bgIvory.png' ?
                                            (
                                                <Box>
                                                    <Image src={'../images/rsb-icon-pink-bgIvory.png'} maxW={400} borderRadius={10} />
                                                    <Text>RSB Dice</Text>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <Image src={bet.imgUrl} maxW={500} borderRadius={10} />
                                                    <Text>{bet.imgUrl?.slice(0, 40) + '...' + bet.imgUrl?.slice(-10)}</Text>
                                                </Box>
                                            )}

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
                                                        return <Button bg="#FF4993" color="whiteAlpha.800" onClick={handleBuy}>Buy</Button>
                                                    case '2':
                                                        return <Button bg="#FF4993" color="whiteAlpha.800" onClick={handleValidate}>Validate</Button>
                                                    case '3':
                                                        return <Button bg="#FF4993" color="whiteAlpha.800" onClick={handleSettle}>Settle</Button>
                                                    case '4':
                                                        return <Button bg="#FF4993" color="whiteAlpha.800" onClick={handleClaim}>Claim</Button>
                                                    case '5':
                                                        return <Button bg="#FF4993" color="whiteAlpha.800" onClick={handleAlreadyClaimed}>Claimed!</Button>
                                                    case '6':
                                                        return <Button bg="#FF4993" color="whiteAlpha.800" onClick={handleDead}>Dead</Button>
                                                    default:
                                                        return <Button bg="#FF4993" color="whiteAlpha.800">Loading</Button>
                                                }
                                            })()
                                        }
                                        <Menu>
                                            <MenuButton bg="#FF4993" color="whiteAlpha.800" as={Button} rightIcon={<ChevronDownIcon />}>
                                                Manage
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem >Change Image</MenuItem>
                                                <MenuItem>Cancel Bet</MenuItem>
                                                <MenuItem>Kill Bet</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Stack>
                                </Stack>
                            </Box>
                            <Box borderRadius={10} p={2}>
                                <Stack bg="rgba(255, 73, 147, 0.2)" borderRadius={10} p={5}>
                                    <Flex direction="row" justify="space-between" align="center">
                                        <Badge colorScheme={BET_STATUS[bet.betStatus]?.color} px={2} mb={1} variant={useColorModeValue("solid", "subtle")}><Text fontSize={24}>{BET_STATUS[bet.betStatus]?.status}</Text></Badge>
                                        <Spacer />
                                        <Heading fontSize={24}>
                                            {
                                                (() => {
                                                    if (accounts[0] && bet.creator) {
                                                        if (bet.creator.toLowerCase() == accounts[0]) {
                                                            return "You are the Creator"
                                                        }
                                                        else if (accounts[0] === bet.affirmation.toLowerCase() || accounts[0] === bet.negation.toLowerCase()) {
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
                                        <Text fontSize={20}>Creator: <Link color="#FF4993" href={`https://goerli.etherscan.io/address/${bet.creator}`} isExternal>{bet.creator}</Link></Text>
                                        <Text fontSize={20}>Collateral: <Link color="#FF4993" href={`https://goerli.etherscan.io/address/${bet.collateral}`} isExternal>{bet.collateral}</Link></Text>
                                        <Stack direction="row" align="center">
                                            <Text fontSize={20}>Expiry: {bet.expiry} -- </Text>
                                            <Stack direction="row" align="center">
                                                <Text fontSize={20}>{new Date(bet.expiry * 1000).toLocaleDateString() != "Invalid Date" ? new Date(bet.expiry * 1000).toLocaleDateString() : "Date out of range"}</Text>
                                                <Text fontSize={20}>{new Date(bet.expiry * 1000).toLocaleTimeString() != "Invalid Date" ? new Date(bet.expiry * 1000).toLocaleTimeString() : null}</Text>
                                            </Stack>
                                        </Stack>
                                        <Text fontSize={20}>
                                            Bet Privacy: {
                                                bet.betPrivacy?.toString() === false ?
                                                    "Public" : "Private"
                                            }
                                        </Text>
                                    </Stack>
                                    <Stack spacing={0}>
                                        <Heading fontSize={24}>Affirmation</Heading>
                                        {bet.affirmation === ZERO_ADDRESS ? <OpenPosition position="Affirmation" /> : <Text fontSize={20}>Address: <Link color="#FF4993" href={`https://goerli.etherscan.io/address/${bet.affirmation}`} isExternal>{bet.affirmation}</Link></Text>}
                                        <Text fontSize={20}>Token: <Link color="#FF4993" href={`https://goerli.etherscan.io/address/${bet.affirmationToken}`} isExternal>{bet.affirmationToken}</Link></Text>
                                        <Text fontSize={20}>Amount: {bet.affirmationAmount}</Text>
                                    </Stack>
                                    <Stack spacing={0}>
                                        <Heading fontSize={24}>Negation</Heading>
                                        {bet.negation === ZERO_ADDRESS ? <OpenPosition position="Negation" /> : <Text fontSize={20}>Address: <Link color="#FF4993" href={`https://goerli.etherscan.io/address/${bet.negation}`} isExternal>{bet.negation}</Link></Text>}
                                        <Text fontSize={20}>Token: <Link color="#FF4993" href={`https://goerli.etherscan.io/address/${bet.negationToken}`} isExternal>{bet.negationToken}</Link></Text>
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