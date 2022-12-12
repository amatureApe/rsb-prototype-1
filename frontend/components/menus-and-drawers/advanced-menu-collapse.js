import NumInput from "../inputs/number-input"
import { HStack, Stack, Box, Divider, Heading, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react"
import { ChevronUpIcon } from '@chakra-ui/icons'

const AdvancedMenu = ({ onToggleAdvancedMenu, setValidationReward, setLivenessPeriod }) => {
    return (
        <Box bg="rgba(255, 73, 147, 0.2)" borderRadius={10}>
            <Stack h={135} p={2} borderRadius={10}>
                <Box px={5}>
                    <Heading fontSize={18}>Validation Reward</Heading>
                    <NumberInput size='sm' bg="whiteAlpha.700" color="#525252" defaultValue={0} min={0} onChange={setValidationReward}>
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
                <Box px={5} pb={1}>
                    <Heading fontSize={18}>Liveness Period</Heading>
                    <NumberInput size='sm' bg="whiteAlpha.700" color="#525252" defaultValue={0} min={0} onChange={setLivenessPeriod}>
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
            </Stack>
        </Box>
    )
}

export default AdvancedMenu
