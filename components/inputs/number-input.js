import {
    Box,
    Heading,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'

const NumInput = ({ headingText, onChange }) => {
    return (
        <Box>
            <Heading>{headingText}</Heading>
            <NumberInput size='sm' bg="whiteAlpha.700" color="#525252" defaultValue={0} min={0} mb={4} onChange={onChange}>
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
    )
}

export default NumInput