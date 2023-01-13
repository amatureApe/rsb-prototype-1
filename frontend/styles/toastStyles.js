import {
    Box,
    Stack,
    Heading,
    Text,
    Button,
    useToast,
    useColorModeValue,
} from "@chakra-ui/react"

import { CloseIcon } from "@chakra-ui/icons"

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
    position: 'top-left',
    duration: 20000,
    render: function renderToast() {
        return (
            <Box borderRadius={10} borderWidth='3px' borderColor={useColorModeValue('blackAlpha.700', '#FF4993')} p={1}>
                <Box bg='#202023' borderRadius={10}>
                    <Stack bg={useColorModeValue('#FF4993', 'rgba(255, 73, 147, 0.3)')} p={3} borderRadius={10}>
                        <Stack direction="row" justify="space-between">
                            <Heading fontSize={22} color='whiteAlpha.900'>Already Claimed!</Heading>
                            <Button size="xs" variant="ghost" onClick={() => toast.close(id)}> <CloseIcon /></Button>
                        </Stack>
                        <Text color='whiteAlpha.900'>The winnings for this bet have already been claimed</Text>
                    </Stack>
                </Box>
            </Box >
        )
    }
}
