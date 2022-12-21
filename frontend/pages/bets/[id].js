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
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'

import { ChevronDownIcon } from "@chakra-ui/icons"

import contractConnection from "../../utils/contractConnection"
import getBet from "../../utils/getBet"

import handler from '../../../smart-contracts/deployments/goerli/OO_BetHandler.json'


const Details = ({ accounts, id }) => {
    const [bet, setBet] = useState([])
    let contract

    const getContract = async () => {
        contract = await contractConnection(handler.address, handler.abi)
    }

    (async () => await getContract())()

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
                                <MenuItem>Delete</MenuItem>
                            </MenuList>
                        </Menu>
                    </Stack>
                    <Stack direction="row" justify="center">
                        <Text>Description</Text>
                    </Stack>
                </Stack>
                <Box borderWidth="1px" borderColor="#FF4993" borderRadius={10} p={5}>
                    <Stack bg="rgba(255, 73, 147, 0.2)" borderRadius={10} p={5} m>
                        <Flex direction="row" justify="space-between" align="center">
                            <Heading fontSize={32}>Bet Info</Heading>
                            <Spacer />
                            <Heading fontSize={24}>
                                {
                                    (() => {
                                        if (utils.getAddress(accounts[0]) == utils.getAddress(bet.creator)) {
                                            return "Owner"
                                        }
                                        else if (utils.getAddress(accounts[0] === bet.affirmation) || utils.getAddress(accounts[0] === bet.negation)) {
                                            return "Participant"
                                        } else {
                                            return null
                                        }
                                    })()
                                }
                            </Heading>
                            <Spacer />
                            <Text>ID: {id}</Text>
                            <Spacer />
                        </Flex>
                        <Text>Bet Status: {bet.betStatus}</Text>
                        <Text>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</Text>
                        <Text>Bet Privacy: {bet.betPrivacy?.toString()}</Text>
                        <Text>Collateral: {bet.collateral}</Text>
                        <Text>Expiry: {bet.expiry}</Text>
                        <Text>Creator: {bet.creator}</Text>
                        <Text>Bet Privacy: {bet.betPrivacy}</Text>
                        <Text>Affirmation: {bet.affirmation}</Text>
                        <Text>Affirmation Token: {bet.affirmationToken}</Text>
                        <Text>Affirmation Amount: {bet.affirmationAmount}</Text>
                        <Text>Negation: {bet.negation}</Text>
                        <Text>Negation Token: {bet.negationToken}</Text>
                        <Text>Negation Amount: {bet.negationAmount}</Text>
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