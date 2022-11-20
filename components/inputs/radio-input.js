import {
    Flex,
    Heading,
    Text,
    RadioGroup,
    Stack,
    Radio
} from '@chakra-ui/react'


const RadioButton = ({ headingText, descText, onChange, value }) => {
    return (
        <Flex direction="column" justify="center" align="center" px={2}>
            <Heading>{headingText}</Heading>
            <Text mb={1}>{descText}</Text>
            <RadioGroup onChange={onChange} value={value} mb={4}>
                <Stack direction='row'>
                    <Radio value='1' colorScheme="pink">Public</Radio>
                    <Radio value='2' colorScheme="pink">Private</Radio>
                </Stack>
            </RadioGroup>
        </Flex>
    )
}

export default RadioButton