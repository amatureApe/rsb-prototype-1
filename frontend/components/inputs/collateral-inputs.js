import {
    Box,
    Stack,
    Heading,
    Input,
    Badge,
    useColorModeValue
} from '@chakra-ui/react'

const CollateralInputs = ({ setAffirmationCollateral, setNegationCollateral }) => {
    return (
        <Stack direction="row" justify="space-between">
            <Box w="45%">
                <Badge colorScheme="green" borderTopRadius={15} px={2} variant={useColorModeValue("solid", "subtle")}>
                    <Heading fontSize={20}> Affirmation Collateral</Heading>
                </Badge>
                <Input bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Collateral token address" onChange={(e) => setAffirmationCollateral(e.target.value)} />

            </Box>
            <Box w="45%">
                <Badge colorScheme="red" px={2} borderTopRadius={15} variant={useColorModeValue("solid", "subtle")} >
                    <Heading fontSize={20}>Negation Collateral</Heading>
                </Badge>
                <Input bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Collateral token address" onChange={(e) => setNegationCollateral(e.target.value)} />
            </Box>
        </Stack >
    )
}

export default CollateralInputs