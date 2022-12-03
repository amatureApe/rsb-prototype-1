import {
    Flex,
    Box,
    Stack,
    Text,
    Spacer,
    Input
} from '@chakra-ui/react'
import RadioButton from './radio-input'

const RadioSettings = ({ betPrivacy, handleBetPrivacy, betSide, setBetSide }) => {
    return (
        <Box borderWidth="1px" borderColor="#FF4993" bg="rgba(255, 73, 147, 0.2)">
            <Stack h={135} p={2} borderRadius={10} direction="column" justify="space-between" align="flex">
                <Stack pt={1} direction="row" align="center">
                    <RadioButton
                        headingText={"Bet Privacy"}
                        descText={"Is your bet public or private?"}
                        onChange={handleBetPrivacy}
                        value={betPrivacy}
                        valText1={"Public"}
                        valText2={"Private"}
                    />
                    {betPrivacy === '2' ? (
                        <Box w="60%">
                            <Spacer />
                            <Stack spacing={0} borderWidth={1} px={1} borderColor="#FF4993">
                                <Text fontSize={16}>Counterparty</Text>
                                <Input size="sm" bg="whiteAlpha.800" color="#525252" _placeholder={{ color: "#525252" }} placeholder="Counterparty address" />

                            </Stack>
                        </Box>
                    ) : (
                        <Text></Text>
                    )}
                    <Spacer />
                </Stack>
                <Box pb={1}>
                    <RadioButton
                        headingText={"Bet Side"}
                        descText={"Which side of the bet are you on?"}
                        onChange={setBetSide}
                        value={betSide}
                        valText1={"Affirmation"}
                        valText2={"Negation"} />
                </Box>
            </Stack>
        </Box >
    )
}

export default RadioSettings