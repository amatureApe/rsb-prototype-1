import { useState } from 'react'
import { Box, Container, Heading, Stack, Text, Spacer } from '@chakra-ui/react'
import { BsTwitter } from 'react-icons/bs'

import Head from 'next/head'
import Navbar from '../navbar.js'
import NoSsr from '../icons-and-logos/no-ssr.js'
import VoxelDog from '../icons-and-logos/voxel-img.js'


const Main = ({ children, router, accounts, setAccounts, chainId, setChainId }) => {
    return (
        <Box as="main" pb={8}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>amatureApe - Homepage</title>
            </Head>
            <Box pb={20}>
                <Navbar path={router.asPath} accounts={accounts} setAccounts={setAccounts} chainId={chainId} setChainId={setChainId} />
            </Box>
            <NoSsr>
                <VoxelDog />
            </NoSsr>
            {children}
            <Box mt={10} align="center" borderTop="1px" borderColor="#FF4993">
                <Spacer my={10} />
                <Stack direction="row" justify="center" spacing={10}>
                    <Text>Discord</Text>
                    <Text>Twitter</Text>
                    <Text>Telegram</Text>
                    <Text>Docs</Text>
                    <Text>UMA</Text>
                </Stack>
            </Box>
        </Box>
    )
}

export default Main