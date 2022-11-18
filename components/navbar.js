import Logo from './logo'
import NextLink from 'next/link'
import {
    Container,
    Box,
    Link,
    Stack,
    Heading,
    Flex,
    Text,
    Button,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    IconButton,
    useColorModeValue
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './theme-toggle-button'

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
    const { path, accounts, setAccounts } = props
    const isConnected = Boolean(accounts[0])

    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setAccounts(accounts)
        }
    }
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
                    <LinkItem href="/open-bets" path={path}>
                        Open Bets
                    </LinkItem>
                    <LinkItem href="/your-bets" path={path}>
                        Your Bets
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
                    <Flex direction="row" align="center">
                        <Button
                            bg="#FF4993"
                            color="whiteAlpha.800"
                            _hover={{ bg: 'pink.500' }}
                        >
                            <Flex direction="column">
                                <Text>Connected</Text>
                                <Text>Hello</Text>
                            </Flex>

                        </Button>
                    </Flex>
                ) : (
                    <Button
                        bg="#FF4993"
                        color="whiteAlpha.800"
                        _hover={{ bg: 'pink.500' }}
                        onClick={connectAccount}
                    >Connect</Button>
                )}
            </Container>
        </Box>
    )
}

export default Navbar