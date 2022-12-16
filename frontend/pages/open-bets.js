import {
    ChakraProvider,
    Button,
    Box,
    Text,
    Spacer,
    Stack,
    Container,
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    Badge,
    Switch,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    useDisclosure
} from '@chakra-ui/react'

import { PhoneIcon, SearchIcon, CheckIcon, ChevronDownIcon, StarIcon } from '@chakra-ui/icons'

import Layout from '../components/layout/article'
import CardsWrap from '../components/open-bets-cards'
import Sidebar from '../components/menus-and-drawers/open-bets-sidebar'

import theme from '../lib/theme'
import { ethers, utils, BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import contractConnection from '../utils/contractConnection'
import erc20ABI from '../utils/abis/erc20ABI.json'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const OpenBets = ({ Component, pageProps, router }) => {
    const [bets, setBets] = useState([])
    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure()
    const [hidden, setHidden] = useState(!isOpen)

    const [count, setCount] = useState(0)


    const getBet = async (betId) => {
        const contract = await contractConnection(handler.address, handler.abi)

        const betInfo = await contract.bets(betId)

        const bet = {
            creator: utils.getAddress(betInfo.betDetails.creator),
            betId: utils.formatUnits(betInfo.betId, 0),
            expiry: utils.formatUnits(betInfo.betDetails.expiry, 0),
            imgUrl: utils.toUtf8String(betInfo.betDetails.imgUrl),
            collateral: utils.getAddress(betInfo.betDetails.bondCurrency),
            collateralSymbol: await getSymbol(utils.getAddress(betInfo.betDetails.bondCurrency)),
            question: utils.toUtf8String(betInfo.betDetails.question),
            betStatus: utils.formatUnits(betInfo.betDetails.betStatus, 0),
            affirmation: utils.getAddress(betInfo.affirmation),
            affirmationAmount: utils.formatEther(betInfo.affirmationAmount),
            negation: utils.getAddress(betInfo.negation),
            negationAmount: utils.formatEther(betInfo.negationAmount)
        }

        console.log(bet.imgUrl)

        setBets([...bets, bet])
    }

    const getSymbol = async (addr) => {
        const token = await contractConnection(addr, erc20ABI)
        const symbol = await token.symbol()
        return symbol
    }

    const handleBet = async () => {

        const contract = await contractConnection(handler.address, handler.abi)
        const betIndex = (await contract.betId()).toNumber()

        await getBet(count)
        if (count >= betIndex - 1) {
            setCount(0)
        } else {
            setCount(count + 1)
        }
    }

    return (
        <Layout title="Set Bet">
            <Button colorScheme="pink" onClick={handleBet} m={5}>
                Click
            </Button>
            <Container maxW="full" borderWidth="1px" borderColor="#FF4993" borderRadius="10px" mb={4}>
                <Stack direction="row" justify="space-between" align="center" m={5}>
                    <Button {...getButtonProps()}>Filters</Button>
                    <Stack spacing={4}>
                        <InputGroup>
                            <Input placeholder='Enter amount' w={500} />
                            <InputRightElement children={<SearchIcon color='pink.200' />} />
                        </InputGroup>
                    </Stack>
                    <Stack direction="row" spacing={5}>
                        <Stack align='center' direction='row' justify="center">
                            <Text>Owned</Text>
                            <Switch size='md' />
                        </Stack>
                        <Menu>
                            <MenuButton
                                px={4}
                                py={1.5}
                                transition='all 0.2s'
                                borderRadius='md'
                                borderWidth='1px'
                                bg="#FF4993"
                                color="whiteAlpha.900"
                                _hover={{ bg: 'pink.500' }}
                                _expanded={{ bg: 'rgba(255, 255, 255, 0.16)' }}
                            >
                                Sort By <ChevronDownIcon />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>New File</MenuItem>
                                <MenuItem>New Window</MenuItem>
                                <MenuDivider />
                                <MenuItem>Open...</MenuItem>
                                <MenuItem>Save File</MenuItem>
                            </MenuList>
                        </Menu>
                        <Button
                            color="whiteAlpha.900"
                            bg="#FF4993"
                            isActive={false}
                            _active={{
                                bg: 'rgba(255, 73, 147, 0.2)',
                                transform: 'scale(1.05)',
                                borderWidth: "1px",
                                borderColor: '#FF4993',
                            }}>
                            <StarIcon />
                        </Button>
                    </Stack>
                </Stack>
            </Container>
            <Stack direction="row">
                <Sidebar getButtonProps={getButtonProps} getDisclosureProps={getDisclosureProps} isOpen={isOpen} hidden={hidden} setHidden={setHidden} />
                <CardsWrap bets={bets} />
            </Stack>
        </Layout >
    )
}

export default OpenBets