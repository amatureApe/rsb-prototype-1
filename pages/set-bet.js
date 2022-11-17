import {
    Container,
    Heading,
    Textarea,
    Input,
    Button,
    FormLabel,
    FormControl,
    Radio,
    RadioGroup,
    Stack,
    Text,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../components/layout/article'
import React from 'react'
import { useState } from 'react'

const Works = () => {
    const [value, setValue] = React.useState('1')
    return (
        < Layout title="Works" >
            <Container mt={10} maxW="md" align="center">
                <Heading as="h3" fontSize={20} mb={4}>
                    Set Your Bet!
                </Heading>
            </Container>
            <Heading>Your Bet</Heading>
            <Textarea bg="whiteAlpha.800" mb={4} _placeholder={{ color: "#525252" }} placeholder="What do you want to bet?" />
            <Heading>Collateral</Heading>
            <Input bg="whiteAlpha.800" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your collateral token here" />
            <Heading>Bet Size</Heading>
            <NumberInput size='sm' bg="whiteAlpha.700" color="#525252" defaultValue={0} min={0} mb={4}>
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
            <Heading>Validation Reward</Heading>
            <Input bg="whiteAlpha.800" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your reward to validators here" />
            <Heading>Liveness Period</Heading>
            <Input bg="whiteAlpha.800" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your Livness Period here" />
            <Heading>Bet Privacy</Heading>
            <Text mb={1}>Is your bet private?</Text>
            <RadioGroup onChange={setValue} value={value} mb={4}>
                <Stack direction='row'>
                    <Radio value='1'>Affirmation</Radio>
                    <Radio value='2'>Negation</Radio>
                </Stack>
            </RadioGroup>
            <Heading>Bet Side</Heading>
            <Text mb={1}>What side of the bet are you on?</Text>
            <RadioGroup onChange={setValue} value={value} mb={4}>
                <Stack direction='row'>
                    <Radio value='1'>Affirmation</Radio>
                    <Radio value='2'>Negation</Radio>
                </Stack>
            </RadioGroup>
            <Heading>Counter Bet Size</Heading>
            <NumberInput size='sm' bg="whiteAlpha.700" color="#525252" defaultValue={0} min={0} mb={4}>
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
            <Stack direction='row' spacing={4}>
                <Button
                    isLoading={false}
                    loadingText='Submitting'
                    bg='#FF4993'
                    color="whiteAlpha.800"
                    variant='solid'
                >
                    Submit
                </Button>
            </Stack>
        </Layout >
    )
}

export default Works
// export { getServerSideProps } from '../components/chakra'