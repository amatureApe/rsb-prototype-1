import {
    ChakraProvider,
    Box,
    Stack,
    Flex,
    Container,
    Text,
    Grid,
    GridItem
} from '@chakra-ui/react'
import Layout from '../components/layout/main'
import theme from '../lib/theme'

function YourBets({ Component, pageProps, router }) {
    return (
        <Box>
            <div>
                Hello
            </div>
            <Grid
                templateAreas={`
                  "header header"
                  "nav main"
                `}
                gridTemplateRows={'50px 1fr 30px'}
                gridTemplateColumns={'150px 1fr'}
                h='1000px'
                gap='1'
                color='blackAlpha.700'
                fontWeight='bold'
            >
                <GridItem pl='2' bg='orange.300' area={'header'}>
                    Header
                </GridItem>
                <GridItem pl='2' bg='pink.300' area={'nav'}>
                    Nav
                </GridItem>
                <GridItem pl='2' bg='green.300' area={'main'}>
                    Main
                </GridItem>
            </Grid>
        </Box>

    )
}

export default YourBets