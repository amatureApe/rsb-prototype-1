import {
    Flex,
    Heading,
    Text,
    RadioGroup,
    Stack,
    Radio
} from '@chakra-ui/react'


const RadioButton = ({ headingText, descText, onChange, value, valText1, valText2 }) => {
    return (
        <Stack direction="column" justify="center" align="center" px={2} spacing={0}>
            <Heading>{headingText}</Heading>
            <Text>{descText}</Text>
            <RadioGroup onChange={onChange} value={value} mb={4}>
                <Stack direction='row'>
                    <Radio value='1' colorScheme="pink">{valText1}</Radio>
                    <Radio value='2' colorScheme="pink">{valText2}</Radio>
                </Stack>
            </RadioGroup>
        </Stack>
    )
}

export default RadioButton