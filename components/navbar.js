import Logo from './logo'
import NextLink from 'next/link'
import {
    Container,
    Box,
    Link,
    Stack,
    Heading,
    Flex,
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
    const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
    return (
        <NextLink href={href} passHref scroll={false}>
            <Link
                p={2}
                bg={active ? '#81e6d9' : undefined}
                color={active ? '#374151' : inactiveColor}
                target={target}
                {...props}
            >
                {children}
            </Link>
        </NextLink>
    )
}

const Navbar = props => {
    const { path } = props
    return (
        <Box
            position="fixed"
            as="nav"
            w="100%"
            mt={4}
            bg={useColorModeValue('#ffffff40', '#20202380')}
            style={{ backdropFilter: 'blur(10px' }}
            zIndex={1}
            {...props}
        >
            <Container display="flex" p={3} maxW="container.md" wrap="wrap" align="center" justify="space-between">
                <Flex align="center" mr={5}>
                    <Heading as="h1" size="lg" letterSpacing={'tighter'}>
                        <Logo />
                    </Heading>
                </Flex>
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    display={{ base: 'none', md: 'flex' }}
                    width={{ base: 'full', md: 'auto' }}
                    alignItems="center"
                    flexgrow={1}
                    mt={{ base: 4, nmd: 0 }}
                >
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

                </Stack>
                <Box flex={1} align="right">
                    <ThemeToggleButton />
                    <Box ml={2} display={{ base: 'inline-block' }}>
                        <Menu>
                            <MenuButton as={IconButton} icon={<HamburgerIcon />} variant="outline" aria-label="Options" />
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
            </Container >
        </Box >
    )
}

export default Navbar