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
    Badge,
    Link,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'

import { StarIcon, ExternalLinkIcon } from '@chakra-ui/icons'

import contractConnection from '../utils/contractConnection'
import checkApproval from '../utils/checkApproval'

import getRatio from '../utils/getRatio'
import { milliToSec, secToMilli } from '../utils/date-picker-funcs'
import { ZERO_ADDRESS, BET_STATUS } from '../consts'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'
import { PendingStyle, SuccessStyle, ErrorStyle } from '../styles/toastStyles'


const CardsWrap = ({ bets, accounts }) => {

    const Toast = useToast()

    const handleBuy = async (bet) => {
        const contract = await contractConnection(handler.address, handler.abi)
        try {
            await checkApproval(bet.affirmation === ZERO_ADDRESS ? bet.affirmationToken : bet.negationToken, handler.address, accounts)

            Toast(PendingStyle)
            const takeBetTx = await contract.takeBet(bet.betId)
            await takeBetTx.wait()
            Toast(SuccessStyle)
        } catch (error) {
            Toast(ErrorStyle(error))
        }
    }

    return (
        <Box px={5}>
            <Wrap spacing={5}>
                {!bets ? <Box /> : bets.map((bet) => {
                    const betStatus = <Badge colorScheme={BET_STATUS[bet.betStatus].color} mb={1} variant={useColorModeValue("solid", "subtle")}>{BET_STATUS[bet.betStatus].status}</Badge>
                    const openPosition = bet.creator === bet.affirmation ?
                        <Badge colorScheme='red' mb={1} variant={useColorModeValue("solid", "subtle")}>Negation</Badge> :
                        <Badge colorScheme='green' mb={1} variant={useColorModeValue("solid", "subtle")}>Affirmation</Badge>
                    const odds = bet.creator == bet.affirmation ?
                        <Badge colorScheme="red" py={1} variant={useColorModeValue("solid", "subtle")}><Badge colorScheme="red" py={1} variant={useColorModeValue("solid", "subtle")}><Text>{getRatio(bet.affirmationAmount, bet.negationAmount, 0.05)}</Text></Badge></Badge> :
                        <Badge colorScheme="green" py={1} variant={useColorModeValue("solid", "subtle")}><Badge colorScheme="green" py={1} variant={useColorModeValue("solid", "subtle")}><Text>{getRatio(bet.negationAmount, bet.affirmationAmount, 0.05)}</Text></Badge></Badge>
                    return (
                        <WrapItem borderWidth={1} borderColor="#FF4993" borderRadius={10} key={bet.betId}>
                            <Center w={400}>
                                <Card bg={useColorModeValue("#f0e7db", "#202023")} p={1.5}>
                                    <Box bg="rgba(255, 73, 147, 0.2)" borderRadius={10} p={1.5}>
                                        <CardHeader bg={useColorModeValue("#f0e7db", "#202023")} p={2} mx={4} borderTopRadius={10}>
                                            <Stack direction="row" justify="space-between">
                                                <Stack direction="row" align="center" justify="center">
                                                    <Text fontSize="14px">Status: {betStatus}</Text>
                                                </Stack>
                                                <Flex direction="row" justify="center" align="center">
                                                    <Text fontSize="14px">Position: {openPosition}</Text>
                                                </Flex>
                                                <Stack direction="row" justify="center" align="center">
                                                    <StarIcon />
                                                    <Link href={`/bets/${bet.betId}`} isExternal>
                                                        <ExternalLinkIcon mb={0.5} />
                                                    </Link>
                                                </Stack>
                                            </Stack>
                                        </CardHeader>
                                        <CardBody>
                                            <Text fontSize="14px" mt={-4} color="#FF4993">ID: {bet.betId}</Text>
                                            <Stack direction="row">
                                                <Image src={bet.imgUrl} boxSize="100px" />
                                                <Stack direciton="row" justify="space-between">
                                                    <Text fontSize="14px" noOfLines={4}>
                                                        {bet.question}
                                                    </Text>
                                                    <Stack direction="row" spacing={2}>
                                                        <Text fontSize="12px">Expires At:</Text>
                                                        <Text fontSize="12px">{new Date(secToMilli(bet.expiry)).toLocaleDateString()} {new Date(secToMilli(bet.expiry)).toLocaleTimeString()}</Text>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <Divider mt={3} mb={2} bg="#FF4993" />
                                            <Box bg={useColorModeValue("#f0e7db", "#202023")} p={2} borderBottomRadius={10} mb={-5}>
                                                <Stack direction="row" justify="space-between">
                                                    <Stack direction="column" spacing={1}>
                                                        <Stack>
                                                            <Badge fontSize="10px" colorScheme="green" variant={useColorModeValue("solid", "subtle")}>
                                                                <Flex>
                                                                    <Text>Affirmation: </Text>
                                                                    <Spacer px={2} />
                                                                    <Text>{bet.affirmationAmount} {bet.collateralSymbol}</Text>
                                                                </Flex>
                                                            </Badge>
                                                        </Stack>
                                                        <Stack>
                                                            <Badge fontSize="10px" colorScheme="red" variant={useColorModeValue("solid", "subtle")}>
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
                                                        {bet.betStatus === '1' ?
                                                            <Button h="24px" bg="#FF4993" color="whiteAlpha.900" onClick={() => handleBuy(bet)}>Buy</Button> :
                                                            <Button h="24px" bg="#FF4993" color="whiteAlpha.900" onClick={() => window.open(`/bets/${bet.betId}`)}>View</Button>
                                                        }
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        </CardBody>
                                    </Box>
                                </Card>
                            </Center>
                        </WrapItem>
                    )
                })}
            </Wrap>
        </Box>
    )
}

export default CardsWrap