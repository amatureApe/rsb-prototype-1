import {
    Flex,
    Box,
} from '@chakra-ui/react'
import RadioButton from './radio-input'

const RadioSettings = ({ betPrivacy, handleBetPrivacy, betSide, setBetSide }) => {
    return (
        <Flex direction="row" justify="space-between">
            {betPrivacy === '1' ? (
                <Box borderTop="2px" borderLeft="2px" borderRight="1px" borderColor="rgba(255, 73, 147, 0)">
                    <RadioButton
                        headingText={"Bet Privacy"}
                        descText={"Is your bet public or private?"}
                        onChange={handleBetPrivacy}
                        value={betPrivacy}
                        valText1={"Public"}
                        valText2={"Private"}
                    />
                </Box>
            ) : (
                <Box borderTop="2px" borderLeft="2px" borderRight="1px" borderColor="rgba(255, 73, 147, 0.2)">
                    <RadioButton
                        headingText={"Bet Privacy"}
                        descText={"Is your bet public or private?"}
                        onChange={handleBetPrivacy}
                        value={betPrivacy}
                        valText1={"Public"}
                        valText2={"Private"}
                    />
                </Box>
            )}
            <Box borderTop="2px" borderLeft="1px" borderRight="2px" borderColor="rgba(255, 73, 147, 0)">
                <RadioButton
                    headingText={"Bet Side"}
                    descText={"Which side of the bet are you on?"}
                    onChange={setBetSide}
                    value={betSide}
                    valText1={"Affirmation"}
                    valText2={"Negation"} />
            </Box>
        </Flex>
    )
}

export default RadioSettings