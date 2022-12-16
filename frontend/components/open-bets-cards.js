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
    useColorModeValue
} from '@chakra-ui/react'

import { StarIcon } from '@chakra-ui/icons'

import contractConnection from '../utils/contractConnection'
import checkApproval from '../utils/checkApproval'

import getRatio from '../utils/getRatio'
import { milliToSec, secToMilli } from '../utils/date-picker-funcs'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'


const CardsWrap = ({ bets }) => {
    const handleBuy = async (betId) => {
        const contract = await contractConnection(handler.address, handler.abi)

    }

    return (
        <Box px={0}>
            <Wrap>
                {bets.map((bet) => {
                    const creatorPosition = bet.creator === bet.affirmation ? 'Aff' : 'Neg'
                    const openPosition = bet.creator === bet.affirmation ?
                        <Badge colorScheme='red' mb={1}>Negation</Badge> :
                        <Badge colorScheme='green' mb={1}>Affirmation</Badge>
                    const odds = bet.creator == bet.affirmation ?
                        <Badge colorScheme="red" py={1}><Badge colorScheme="red" py={1}><Text>{getRatio(bet.affirmationAmount, bet.negationAmount, 0.05)}</Text></Badge></Badge> :
                        <Badge colorScheme="green" py={1}><Badge colorScheme="green" py={1}><Text>{getRatio(bet.negationAmount, bet.affirmationAmount, 0.05)}</Text></Badge></Badge>
                    return (
                        <WrapItem borderWidth={1} borderColor="#FF4993" borderRadius={10} key={bet.betId}>
                            <Center w={400}>
                                <Card bg={useColorModeValue("#f0e7db", "#202023")}>
                                    <CardHeader>
                                        <Stack direction="row" justify="space-between">
                                            <Stack direction="row" align="center" justify="center">
                                                <Heading fontSize="14px">Id: {bet.betId}</Heading>
                                                <Heading fontSize="14px">Status: {bet.betStatus}</Heading>
                                            </Stack>
                                            <Flex direction="row" justify="center" align="center">
                                                <Text fontSize="14px">Position: {openPosition}</Text>
                                            </Flex>
                                            <Stack>
                                                <StarIcon />
                                            </Stack>
                                        </Stack>
                                        <Divider mb={-10} />
                                    </CardHeader>
                                    <CardBody>
                                        <Stack direction="row">
                                            <Image src={bet.imgUrl} boxSize="100px"></Image>
                                            <Stack direciton="row" justify="space-between">
                                                <Text fontSize="14px" noOfLines={3}>
                                                    {bet.question}
                                                </Text>
                                                <Stack direction="row" spacing={2}>
                                                    <Text fontSize="12px">Expires At:</Text>
                                                    <Text fontSize="12px">{new Date(secToMilli(bet.expiry)).toLocaleDateString()} {new Date(secToMilli(bet.expiry)).toLocaleTimeString()}</Text>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        <Divider mt={3} mb={2} />
                                        <Stack direction="row" justify="space-between">
                                            <Stack direction="column" spacing={1}>
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
                                                <Button h="24px" bg="#FF4993" onClick={handleBuy}>Buy</Button>
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
    )
}

export default CardsWrap