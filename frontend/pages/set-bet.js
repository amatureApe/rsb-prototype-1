import React from 'react'
import { useState, useRef } from 'react'
import { ethers, BigNumber, utils } from 'ethers'
import {
    Container,
    Heading,
    Textarea,
    Input,
    Button,
    Box,
    Icon,
    Stack,
    HStack,
    Text,
    Image,
    Divider,
    Collapse,
    useDisclosure,
    useColorModeValue
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'

import Layout from '../components/layout/article'
import NumInput from '../components/inputs/number-input'
import AdvancedMenu from '../components/menus-and-drawers/advanced-menu-collapse'
import HelpDrawer from '../components/menus-and-drawers/help-drawer'
import RadioSettings from '../components/inputs/bet-radio-settings'
import UMAIcon from '../components/icons-and-logos/uma-icon'
import NoSsr from '../components/icons-and-logos/no-ssr'
import VoxelDog from '../components/icons-and-logos/voxel-img'

import contractConnection from '../utils/contractConnection'

import erc20ABI from '../utils/abis/erc20ABI.json'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const SetBet = () => {
    const [bet, setBet] = useState('')
    const [collateral, setCollateral] = useState('')
    const [betSize, setBetSize] = useState(0)
    const [validationReward, setValidationReward] = useState('0')
    const [livenessPeriod, setLivenessPeriod] = useState('0')
    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')
    const [counterParty, setCounterParty] = useState('0x0000000000000000000000000000000000000000')
    const [counterBet, setCounterBet] = useState(0)

    const args = [
        bet,
        collateral,
        validationReward,
        livenessPeriod,
        betPrivacy,
        counterParty,
        betSide,
        betSize,
        counterBet
    ]

    const prepareData = (
        _question,
        _bondCurrency,
        _reward,
        _liveness,
        _privateBet,
        _privateBetRecipient,
        _affirmation,
        _betAmount,
        _counterBetAmount
    ) => {
        const data = [
            _question,
            _bondCurrency,
            utils.parseEther(_reward),
            BigNumber.from(_liveness),
            _privateBet === '1' ? false : true,
            _privateBetRecipient,
            _affirmation === '1' ? true : false,
            utils.parseEther(_betAmount),
            utils.parseEther(_counterBetAmount)
        ]

        return data
    }

    const {
        isOpen: isOpenAdvancedMenu,
        onToggle: onToggleAdvancedMenu
    } = useDisclosure()

    const {
        isOpen: isOpenCounterparty,
        onToggle: onToggleCounterparty
    } = useDisclosure()

    const {
        isOpen: isOpenHelpDrawer,
        onToggle: onToggleHelpDrawer,
    } = useDisclosure()
    const helpBtnRef = useRef()

    const handleBetChange = (e) => {
        let value = e.target.value
        setBet(value)
    }

    const handleBetPrivacy = (betPrivacy) => {
        setBetPrivacy(betPrivacy)
        onToggleCounterparty()
    }

    const handleCollateralChange = (e) => {
        let value = e.target.value
        setCollateral(value)
    }

    const handleCounterpartyChange = (e) => {
        let value = e.target.value
        setCounterParty(value)
    }

    const checkApproval = async () => {
        const token = await contractConnection(collateral, erc20ABI)
    }

    const handleSetBet = async () => {
        const contract = await contractConnection(handler.address, handler.abi)
        console.log(prepareData(...args))
        try {
            const response = await contract.setBet(...prepareData(...args))
        } catch (err) {
            console.log("error: ", err)
        }
    }

    return (
        <Layout title="Set Bet">
            <Container maxW="container.md">
                <Stack justify="space-between" direction="row" align="end">
                    <Heading>Your Bet</Heading>
                    <Stack justify="space-between" align="center" direction="row">
                        <Button ref={helpBtnRef} onClick={onToggleHelpDrawer} m={2} variant="ghost" colorScheme="pink">Need Help?</Button>
                        {isOpenAdvancedMenu ? (
                            <Button variant="outline" colorScheme="pink" onClick={onToggleAdvancedMenu}>Advanced <ChevronUpIcon /></Button>
                        ) : (
                            <Button variant="outline" colorScheme="pink" onClick={onToggleAdvancedMenu}>Advanced <ChevronDownIcon /></Button>
                        )}
                    </Stack>
                </Stack>
                <Textarea bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="What do you want to bet?" onChange={handleBetChange} />

                <Heading>Collateral</Heading>
                <Input bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your collateral token here" onChange={handleCollateralChange} />

                <NumInput headingText={"Bet Size"} onChange={setBetSize} />

                <Collapse in={isOpenAdvancedMenu} animateOpacity>
                    <AdvancedMenu onToggleAdvancedMenu={onToggleAdvancedMenu} setValidationReward={setValidationReward} setLivenessPeriod={setLivenessPeriod} />
                </Collapse>

                <RadioSettings betPrivacy={betPrivacy} handleBetPrivacy={handleBetPrivacy} betSide={betSide} setBetSide={setBetSide} />

                <Collapse in={isOpenCounterparty} animateOpacity>
                    <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" />
                    <Box bg="rgba(255, 73, 147, 0.2)" px={2}>
                        <Heading pt={1}>Counterparty</Heading>
                        <Input bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your Counterparty's address" onChange={handleCounterpartyChange} />
                    </Box>
                    <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" mb={2} />
                </Collapse>

                <NumInput headingText={"Counter Bet"} onChange={setCounterBet} />

                <Stack direction='row' spacing={4} align="center" justify="space-between">
                    <Button
                        isLoading={false}
                        loadingText='Submitting'
                        bg='#FF4993'
                        color="whiteAlpha.900"
                        _hover={{ bg: 'pink.500' }}
                        variant='solid'
                        onClick={handleSetBet}
                    >
                        Submit
                    </Button>

                    <HStack>
                        <Text>Validated by</Text>
                        <UMAIcon />
                    </HStack>
                </Stack>

                <HelpDrawer isOpenHelpDrawer={isOpenHelpDrawer} onToggleHelpDrawer={onToggleHelpDrawer} helpBtnRef={helpBtnRef} />
            </Container>
        </Layout >
    )
}

export default SetBet
