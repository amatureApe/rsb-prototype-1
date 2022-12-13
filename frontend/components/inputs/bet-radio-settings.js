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
        <Box borderWidth="0px" borderColor="#FF4993" bg="rgba(255, 73, 147, 0.2)" borderRadius={10}>
            <Stack h={137} p={2} borderRadius={10} direction="column" justify="space-between" align="flex" mx={3}>
                <Stack pt={1} direction="row" align="center">
                    <RadioButton
                        headingText={"Bet Privacy"}
                        descText={"Is your bet public or private?"}
                        onChange={handleBetPrivacy}
                        value={betPrivacy}
                        valText1={"Public"}
                        valText2={"Private"}
                    />
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