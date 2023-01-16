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
    useToast,
    useDisclosure
} from '@chakra-ui/react'

import { PhoneIcon, SearchIcon, CheckIcon, ChevronDownIcon, StarIcon } from '@chakra-ui/icons'

import { LeapFrog } from '@uiball/loaders'

import Layout from '../components/layout/article'
import CardsWrap from '../components/bets-cards'
import Sidebar from '../components/menus-and-drawers/bets-sidebar'

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
    const [badSearch, setBadSearch] = useState(false)
    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure()
    const [hidden, setHidden] = useState(!isOpen)
    const [searchParams, setSearchParams] = useState('')

    const handleBets = async () => {
        setIsLoaded(false)

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

    const searchById = async () => {
        setIsLoaded(false)

        const batch = []
        const response = await getBet(Number(searchParams))
        if (response != undefined) {
            batch.push(response)
        }
        else {
            setIsLoaded(true)
            setBadSearch(true)
            return
        }

        setBets(batch)
        setBadSearch(false)
        setIsLoaded(true)
    }

    useEffect(() => {
        handleBets()
    }, [])

    console.log("PING", searchParams)

    return (
        <Layout title="Set Bet">
            <Heading ml={5}>Bet Manager</Heading>
            <Container maxW="full" borderWidth="1px" borderColor="#FF4993" borderRadius="10px" mb={4}>
                <Stack direction="row" justify="space-between" align="center" m={5}>
                    <Stack direction='row' spacing={4}>
                        <Button {...getButtonProps()} bg="#FF4993" color="whiteAlpha.900">Filters</Button>
                        <Button bg="#FF4993" color="whiteAlpha.900" onClick={handleBets}>Reset</Button>
                    </Stack>
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
                <Sidebar searchById={searchById} setSearchParams={setSearchParams} getButtonProps={getButtonProps} getDisclosureProps={getDisclosureProps} isOpen={isOpen} hidden={hidden} setHidden={setHidden} />
                {
                    isLoaded ?
                        badSearch ?
                            (
                                <Stack direction="row" align='flex-end' position="absolute" left="50%" transform="translateX(-50%)">
                                    <Heading>Error!</Heading>
                                    <Text position='relative' bottom={1}>Your search result does not exist</Text>
                                </Stack>
                            ) : (
                                <CardsWrap bets={bets} accounts={accounts} handleBets={handleBets} />
                            ) : (
                            <Stack direction="row" position="absolute" left="50%" transform="translateX(-50%)">
                                <Heading>LOADING BETS</Heading>
                                <Box position='relative' top={2}>
                                    <LeapFrog color='white' />
                                </Box>
                            </Stack>
                        )
                }
            </Stack>
        </Layout >
    )
}

export default OpenBets