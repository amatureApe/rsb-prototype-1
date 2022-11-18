import {
    Container,
    Heading,
    Textarea,
    Input,
    Button,
    Box,
    Flex,
    FormLabel,
    FormControl,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Spacer,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import Layout from '../components/layout/article'
import React from 'react'
import { useState } from 'react'

const Works = () => {
    const [betPrivacy, setBetPrivacy] = React.useState('1')
    const [betSide, setBetSide] = React.useState('1')
    return (
        < Layout title="Works" >
            <Container mt={10} maxW="md" align="center">
                <Heading as="h3" fontSize={20} mb={4}>
                    Set Your Bet!
                </Heading>
            </Container>
            <Stack justify="space-between" direction="row" align="end">
                <Heading>Your Bet</Heading>
                <Stack justify="space-between" align="center" direction="row">
                    <Button m={2} variant="ghost" colorScheme="pink">Need Help?</Button>
                    <Button variant="outline" colorScheme="pink">Advanced<ChevronDownIcon /></Button>
                </Stack>
            </Stack>
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
            <Flex direction="row" justify="space-between">
                <Flex direction="column" justify="center" align="center">
                    <Heading>Bet Privacy</Heading>
                    <Text mb={1}>Is your bet public or private?</Text>
                    <RadioGroup onChange={setBetPrivacy} value={betPrivacy} mb={4}>
                        <Stack direction='row'>
                            <Radio value='1' colorScheme="pink">Public</Radio>
                            <Radio value='2' colorScheme="pink">Private</Radio>
                        </Stack>
                    </RadioGroup>
                </Flex>
                <Flex direction="column" justify="center" align="center">
                    <Heading>Bet Side</Heading>
                    <Text mb={1}>Which side of the bet are you on?</Text>
                    <RadioGroup onChange={setBetSide} value={betSide} mb={4}>
                        <Stack direction='row'>
                            <Radio value='1' colorScheme="pink">Affirmation</Radio>
                            <Radio value='2' colorScheme="pink">Negation</Radio>
                        </Stack>
                    </RadioGroup>
                </Flex>
            </Flex>
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
                    _hover={{ bg: 'pink.500' }}
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