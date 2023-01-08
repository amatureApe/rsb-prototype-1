import {
    Button,
    Box,
    Text,
    Heading,
    Stack,
    Container,
    InputGroup,
    Input,
    InputRightElement,
    Switch,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    ScaleFade,
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
import getBet from '../utils/getBet'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const OpenBets = ({ accounts }) => {
    const [bets, setBets] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure()
    const [hidden, setHidden] = useState(!isOpen)

    const handleBets = async () => {

        const contract = await contractConnection(handler.address, handler.abi)
        const betIndex = (await contract.betId()).toNumber()

        const batch = []
        for (let i = 0; i < betIndex; i++) {
            const response = await getBet(i)
            if (response != undefined) {
                batch.push(response)
            }
        }

        setBets(batch)
        setIsLoaded(true)
    }

    useEffect(() => {
        handleBets()
    }, [])

    return (
        <Layout title="Set Bet">
            <Heading ml={5}>Bet Manager</Heading>
            <Container maxW="full" borderWidth="1px" borderColor="#FF4993" borderRadius="10px" mb={4}>
                <Stack direction="row" justify="space-between" align="center" m={5}>
                    <Button {...getButtonProps()} bg="#FF4993" color="whiteAlpha.900">Filters</Button>
                    <Stack spacing={4}>
                        <InputGroup>
                            <Input placeholder='Enter amount' w={500} />
                            <InputRightElement children={<SearchIcon color='pink.200' />} />
                        </InputGroup>
                    </Stack>
                    <Stack direction="row" spacing={5}>
                        <Stack align='center' direction='row' justify="center">
                            <Text>Owned</Text>
                            <Switch colorScheme='pink' />
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
                                <MenuItem>Trending</MenuItem>
                                <MenuDivider my={1} />
                                <MenuItem>Liquidity</MenuItem>
                                <MenuDivider my={1} />
                                <MenuItem>Volume</MenuItem>
                                <MenuDivider my={1} />
                                <MenuItem>Newest</MenuItem>
                                <MenuDivider my={1} />
                                <MenuItem>Expiry</MenuItem>
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
                {
                    isLoaded ?
                        <CardsWrap bets={bets} accounts={accounts} /> :
                        <Heading>LOADING BETS...</Heading>
                }
            </Stack>
        </Layout >
    )
}

export default OpenBets