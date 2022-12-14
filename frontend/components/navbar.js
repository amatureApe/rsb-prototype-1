import Logo from './icons-and-logos/main-logo'
import NextLink from 'next/link'
import { useEffect } from 'react'
import {
    Container,
    Box,
    Link,
    Stack,
    Heading,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Flex,
    Text,
    Button,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    IconButton,
    useColorModeValue,
    useDisclosure,
    Divider
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './theme-toggle-button'
import { providers } from 'ethers'
import { AVAILABLE_NETWORKS } from '../consts'


const LinkItem = ({ href, path, target, children, ...props }) => {
    const active = path === href
    const inactiveColor = useColorModeValue('#3D4950', 'whiteAlpha.900')
    return (
        <NextLink href={href} passHref scroll={false}>
            <Link
                p={2}
                bg={active ? '#FF4993' : undefined}
                color={active ? 'whiteAlpha.900' : inactiveColor}
                target={target}
                {...props}
            >
                {children}
            </Link>
        </NextLink>
    )
}

const Navbar = props => {
    const { path, accounts, setAccounts, chainId, setChainId } = props
    const isConnected = Boolean(accounts[0])

    const connectAccount = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setAccounts(accounts)
        }
    }

    const checkNetwork = async () => {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({
                method: 'eth_chainId'
            })
            setChainId(chainId)

            if (AVAILABLE_NETWORKS.includes(chainId)) {
                await connectAccount()
            }
        }
    }

    const switchNetwork = async () => {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x5" }]
        })

        window.location.reload()
    }

    useEffect(() => {
        checkNetwork()
    }, [])

    return (
        <Box
            position="fixed"
            as="nav"
            w="100%"
            bg={useColorModeValue('#ffffff40', '#20202380')}
            style={{ backdropFilter: 'blur(10px' }}
            zIndex={1}
            {...props}
        >
            <Container display="flex" p={3} maxW="container.xl" wrap="wrap" align="center" justify="space-between" mt={2} mb={2}>
                <Box flex={1} align="center">
                    <Logo />
                </Box>
                <Box flex={1} align="center" mt={2}>
                    <LinkItem href="/set-bet" path={path}>
                        Set Bet
                    </LinkItem>
                    <LinkItem href="/bets" path={path}>
                        Bets
                    </LinkItem>
                    <LinkItem href="/stake" path={path}>
                        Stake
                    </LinkItem>
                    <LinkItem href="/about" path={path}>
                        About
                    </LinkItem>
                </Box>
                <Box flex={1} align="center">
                    <ThemeToggleButton />
                    <Box ml={2} display={{ base: 'inline-block' }}>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<HamburgerIcon />}
                                variant="outline"
                                aria-label="Options"
                                bg="#FF4993"
                                _hover={{ bg: 'pink.500' }}
                                color="whiteAlpha.900"
                            />
                            <MenuList>
                                <NextLink href="/set-bet" passHref>
                                    <MenuItem as={Link}>Set Bet</MenuItem>
                                </NextLink>
                                <NextLink href="/open-bets" passHref>
                                    <MenuItem as={Link}>Open Bets</MenuItem>
                                </NextLink>
                                <NextLink href="/your-bets" passHref>
                                    <MenuItem as={Link}>Your Bets</MenuItem>
                                </NextLink>
                                <NextLink href="/about" passHref>
                                    <MenuItem as={Link}>About</MenuItem>
                                </NextLink>
                                <MenuItem as={Link} href="https://github.com/amatureApe/rsb-prototype-1">Docs</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Box>
                {isConnected ? (
                    <Flex direction="row" align="center" px={5}>
                        <Button
                            bg="#FF4993"
                            color="whiteAlpha.900"
                            _hover={{ bg: 'pink.500' }}
                        >
                            <Flex direction="column">
                                <Text fontSize={12}>Connected</Text>
                                <Text fontSize={12}>{accounts[0].slice(0, 4) + '...' + accounts[0].slice(-4)}</Text>
                            </Flex>

                        </Button>
                    </Flex>
                ) : (
                    <Button
                        bg="#FF4993"
                        color="whiteAlpha.900"
                        _hover={{ bg: 'pink.500' }}
                        onClick={connectAccount}
                    >Connect</Button>
                )}
            </Container>
            {isConnected ? (
                <Box />
            ) : (
                <Alert status='error' variant={useColorModeValue("solid", "subtle")}>
                    <AlertIcon />
                    <AlertTitle>Wallet not connected!</AlertTitle>
                    <AlertDescription>Please connect to interact with blockchain.</AlertDescription>
                </Alert>
            )
            }
            {AVAILABLE_NETWORKS.includes(chainId) ? (
                <Box></Box>
            ) : (
                <Box>
                    <Divider />
                    <Alert status='error' variant={useColorModeValue("solid", "subtle")}>
                        <AlertIcon />
                        <AlertTitle>Connected to the wrong network</AlertTitle>
                        <Button size="sm" mx={5} bg={useColorModeValue("#f0e7db", "#FF4993")} color={useColorModeValue("#FF4993", "white")} borderWidth="2px" borderColor="#FF4993" onClick={switchNetwork}>Switch Networks</Button>
                    </Alert>
                </Box>
            )
            }
        </Box >
    )
}

export default Navbar