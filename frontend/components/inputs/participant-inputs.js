import {
    Box,
    Stack,
    Heading,
    Input,
    Badge,
    Spacer,
    Collapse,
    Fade,
    useColorModeValue
} from '@chakra-ui/react'

const ParticipantInputs = ({ betPrivacy, betSide, setAffirmationCollateral, setNegationCollateral }) => {
    return (
        <Collapse in={betPrivacy == 1 ? false : true} animateOpacity >
            <Stack direction="row" justify={betSide == 2 ? "flex-start" : "flex-end"}>
                <Box w="45%">
                    <Fade in={betSide == 1 ? false : true} animateOpacity>
                        <Badge colorScheme="green" borderTopRadius={15} px={2} variant={useColorModeValue("solid", "subtle")}>
                            <Heading fontSize={20}> Affirmation Address</Heading>
                        </Badge>
                        <Input bg="whiteAlpha.800" borderTopLeftRadius={0} color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Affirmation wallet address" onChange={(e) => setAffirmationCollateral(e.target.value)} />
                        <Spacer />
                    </Fade>
                </Box>
                <Box w="45%">
                    <Fade in={betSide == 2 ? false : true} animateOpacity>
                        <Badge colorScheme="red" px={2} borderTopRadius={15} variant={useColorModeValue("solid", "subtle")} >
                            <Heading fontSize={20}>Negation Address</Heading>
                        </Badge>
                        <Input bg="whiteAlpha.800" borderTopLeftRadius={0} color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Negation wallet address" onChange={(e) => setNegationCollateral(e.target.value)} />
                    </Fade>
                </Box>
            </Stack >
        </Collapse >
    )
}

export default ParticipantInputs
