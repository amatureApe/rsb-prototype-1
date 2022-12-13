import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../navbar.js'
import NoSsr from '../icons-and-logos/no-ssr.js'
import VoxelDog from '../icons-and-logos/voxel-img.js'
import { Box, Container, Heading } from '@chakra-ui/react'

const Main = ({ children, router, accounts, setAccounts }) => {
    return (
        <Box as="main" pb={8}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>amatureApe - Homepage</title>
            </Head>
            <Box pb={20}>
                <Navbar path={router.asPath} accounts={accounts} setAccounts={setAccounts} />
            </Box>
            <NoSsr>
                <VoxelDog />
            </NoSsr>
            {children}
            <Box mt={10} align="center" borderTop="1px">
                <Heading mt={5}>INSERT FOOTER</Heading>
            </Box>
        </Box>
    )
}

export default Main