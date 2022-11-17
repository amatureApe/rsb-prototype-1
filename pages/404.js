import NextLink from 'next/link'
import {
    Box,
    Heading,
    Container,
    Divider,
    Text,
    Button
} from '@chakra-ui/react'

const NotFound = () => {
    return (
        <Container mt={10}>
            <Heading as="h1">Not Found</Heading>
            <Text>Sorry, the page you're looking for was not found.</Text>
            <Divider my={6} />

            <Box my={6} align="center">
                <NextLink href="/">
                    <Button bg="#FF4993" color="whiteAlpha.800">Return to home</Button>
                </NextLink>
            </Box>
        </Container>
    )
}

export default NotFound