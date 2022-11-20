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
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import Layout from '../components/layout/article'
import React from 'react'
import { useState } from 'react'
import NumInput from '../components/inputs/number-input'
import RadioButton from '../components/inputs/radio-input'

const SetBet = () => {
    const [bet, setBet] = useState('')
    const [collateral, setCollateral] = useState('')
    const [betSize, setBetSize] = useState(0)
    const [validationReward, setValidationReward] = useState('')
    const [livenessPeriod, setLivenessPeriod] = useState(0)
    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')
    const [counterBet, setCounterBet] = useState(0)

    const handleBetChange = (e) => {
        let value = e.target.value
        setBet(value)
    }

    const handleCollateralChange = (e) => {
        let value = e.target.value
        setCollateral(value)
    }

    console.log(counterBet)


    return (
        < Layout title="Works" >
            <Stack justify="space-between" direction="row" align="end">
                <Heading>Your Bet</Heading>
                <Stack justify="space-between" align="center" direction="row">
                    <Button m={2} variant="ghost" colorScheme="pink">Need Help?</Button>
                    <Button variant="outline" colorScheme="pink">Advanced <ChevronDownIcon /></Button>
                </Stack>
            </Stack>
            <Textarea bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="What do you want to bet?" onChange={handleBetChange} />
            <Heading>Collateral</Heading>
            <Input bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your collateral token here" onChange={handleCollateralChange} />

            <NumInput headingText={"Bet Size"} onChange={setBetSize} />

            <NumInput headingText={"Validation Reward"} onChange={setValidationReward} />
            <NumInput headingText={"Liveness Period"} onChange={setLivenessPeriod} />

            <Flex direction="row" justify="space-between">
                <RadioButton headingText={"Bet Privacy"} descText={"Is your bet public or private?"} onChange={setBetPrivacy} value={betPrivacy} />
                <RadioButton headingText={"Bet Side"} descText={"Which side of the bet are you on?"} onChange={setBetSide} value={betSide} />
            </Flex>

            <NumInput headingText={"Counter Bet"} onChange={setCounterBet} />

            <Stack direction='row' spacing={4}>
                <Button
                    isLoading={false}
                    loadingText='Submitting'
                    bg='#FF4993'
                    color="whiteAlpha.900"
                    _hover={{ bg: 'pink.500' }}
                    variant='solid'
                >
                    Submit
                </Button>
            </Stack>
        </Layout >
    )
}

export default SetBet
