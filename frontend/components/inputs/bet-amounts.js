import {
    Box,
    Stack,
    Heading,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Badge,
    useColorModeValue
} from '@chakra-ui/react'

const BetAmounts = ({ onChange }) => {
    return (
        <Stack direction="row" justify="space-between">
            <Box w="45%">
                <Badge colorScheme="green" borderTopRadius={15} px={2} variant={useColorModeValue("solid", "subtle")}>
                    <Heading fontSize={20}>Affirmation Amount</Heading>
                </Badge>
                <NumberInput size='sm' bg="whiteAlpha.700" borderWidth="0px" borderColor="#FF4993" color="#525252" defaultValue={0} min={0} onChange={onChange}>
                    <NumberInputField focusBorderColor='red.200' />
                    <NumberInputStepper>
                        <NumberIncrementStepper
                            bg='#FF4993'
                            color="whiteAlpha.800"
                            _active={{ bg: 'pink.300' }}
                            children='+'
                            mb={0.5}
                        />
                        <NumberDecrementStepper
                            bg='#FF4993'
                            color="whiteAlpha.800"
                            _active={{ bg: 'pink.300' }}
                            children='-'
                        />
                    </NumberInputStepper>
                </NumberInput>
            </Box>
            <Box w="45%">
                <Badge colorScheme="red" px={2} borderTopRadius={15} variant={useColorModeValue("solid", "subtle")} >
                    <Heading fontSize={20}>Negation Amount</Heading>
                </Badge>
                <NumberInput size='sm' bg="whiteAlpha.700" borderWidth="0px" borderColor="#FF4993" color="#525252" defaultValue={0} min={0} onChange={onChange}>
                    <NumberInputField focusBorderColor='red.200' />
                    <NumberInputStepper>
                        <NumberIncrementStepper
                            bg='#FF4993'
                            color="whiteAlpha.800"
                            _active={{ bg: 'pink.300' }}
                            children='+'
                            mb={0.5}
                        />
                        <NumberDecrementStepper
                            bg='#FF4993'
                            color="whiteAlpha.800"
                            _active={{ bg: 'pink.300' }}
                            children='-'
                        />
                    </NumberInputStepper>
                </NumberInput>
            </Box>
        </Stack >
    )
}

export default BetAmounts