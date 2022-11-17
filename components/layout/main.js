import Head from 'next/head'
import Navbar from '../navbar.js'
import { Box, Container, Heading } from '@chakra-ui/react'

const Main = ({ children, router }) => {
    return (
        <Box as="main" pb={8}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>amatureApe - Homepage</title>
            </Head>
            <Navbar path={router.asPath} />
            <Container maxW="container.md" pt={14}>
                {children}
            </Container>
            <Box mt={10} align="center" borderTop="1px">
                <Heading mt={5}>INSERT FOOTER</Heading>
            </Box>
        </Box>
    )
}

export default Main