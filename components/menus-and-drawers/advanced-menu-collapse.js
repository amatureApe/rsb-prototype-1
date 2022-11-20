import NumInput from "../inputs/number-input"
import { HStack, Text, Box, Divider, Collapse, useDisclosure } from "@chakra-ui/react"
import { ChevronUpIcon } from '@chakra-ui/icons'

const AdvancedMenu = ({ onToggleAdvancedMenu, setValidationReward, setLivenessPeriod }) => {
    return (
        <Box>
            <HStack>
                <Text fontSize={18} bg="rgba(255, 73, 147, 0.2)" px={2} cursor="pointer" onClick={onToggleAdvancedMenu}>Advanced <ChevronUpIcon /></Text>
            </HStack>
            <Box bg="rgba(255, 73, 147, 0.2)">
                <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" mb={2} />
                <NumInput headingText={"Validation Reward"} headingSize={28} onChange={setValidationReward} />
                <NumInput headingText={"Liveness Period"} headingSize={28} onChange={setLivenessPeriod} />
                <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" mb={2} />
            </Box>
        </Box>
    )
}

export default AdvancedMenu
