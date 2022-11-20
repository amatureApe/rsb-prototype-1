import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../navbar.js'
import { Box, Container, Heading } from '@chakra-ui/react'

const Main = ({ children, router }) => {
    const [accounts, setAccounts] = useState([])
    return (
        <Box as="main" pb={8}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>amatureApe - Homepage</title>
            </Head>
            <Box>
                <Navbar path={router.asPath} accounts={accounts} setAccounts={setAccounts} />

            </Box>
            <Container maxW="container.md" pt={20}>
                {children}
            </Container>
            <Box mt={10} align="center" borderTop="1px">
                <Heading mt={5}>INSERT FOOTER</Heading>
            </Box>
        </Box>
    )
}

export default Main