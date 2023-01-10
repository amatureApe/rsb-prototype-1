import { Box, Stack, Heading, Text } from "@chakra-ui/react"


export const PendingStyle = {
    title: 'Pending',
    description: 'Transaction is being confirmed',
    status: 'loading',
    containerStyle: {
        width: '800px',
        maxWidth: '75%',
        border: '2px solid blue',
        borderRadius: '10px',
        padding: '2px'
    },
    variant: 'solid',
    position: 'top-left',
    duration: 20000,
    isClosable: true
}

export const SuccessStyle = {
    title: 'Success!',
    description: 'Transaction has been confirmed',
    status: 'success',
    containerStyle: {
        width: '800px',
        maxWidth: '75%',
        border: '2px solid green',
        borderRadius: '10px',
        padding: '2px'
    },
    variant: 'solid',
    position: 'top-left',
    duration: 20000,
    isClosable: true
}




export const ErrorStyle = (error) => {
    return {
        title: 'Error!',
        description: error.message.toString(),
        status: 'error',
        containerStyle: {
            width: '800px',
            maxWidth: '75%',
            border: '2px solid red',
            borderRadius: '10px',
            padding: '2px'
        },
        variant: 'solid',
        position: 'top-left',
        duration: 20000,
        isClosable: true
    }
}

export const ClaimedStyle = {
    render: () => (
        <Box bg='#202023' borderRadius={10} border='2px solid #FF4993'>
            <Stack bg='rgba(255, 73, 147, 0.3)' p={3} borderRadius={10}>
                <Heading fontSize={22} color='whiteAlpha.900'>Already Claimed!</Heading>
                <Text color='whiteAlpha.900'>The winnings for this bet have already been claimed</Text>
            </Stack>
        </Box>
    ),
    position: 'top-left',
    duration: 20000,
    isClosable: true
}