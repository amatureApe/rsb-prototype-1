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

import getRatio from '../utils/getRatio'

const CardsWrap = ({ bets }) => {
    return (
        <Box px={0}>
            <Wrap>
                {bets.map((bet) => {
                    const creatorPosition = bet.creator === bet.affirmation ? 'Aff' : 'Neg'
                    const openPosition = bet.creator === bet.affirmation ?
                        <Badge colorScheme='red' mb={1}>Negation</Badge> :
                        <Badge colorScheme='green'>Affirmation</Badge>
                    const odds = bet.creator == bet.affirmation ?
                        <Badge colorScheme="red" py={1}><Badge colorScheme="red" py={1}><Text>{getRatio(bet.negationAmount, bet.affirmationAmount, 0.05)}</Text></Badge></Badge> :
                        <Badge colorScheme="green" py={1}><Badge colorScheme="green" py={1}><Text>{getRatio(bet.affirmationAmount, bet.negationAmount, 0.05)}</Text></Badge></Badge>
                    return (
                        <WrapItem borderWidth={1} borderColor="#FF4993" borderRadius={10}>
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
    )
}

export default CardsWrap