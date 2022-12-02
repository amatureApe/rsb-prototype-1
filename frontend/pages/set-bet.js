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
    Flex,
    Stack,
    HStack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    Divider,
    Collapse,
    Spacer,
    useDisclosure,
    useColorModeValue
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon } from '@chakra-ui/icons'

import Layout from '../components/layout/article'
import NumInput from '../components/inputs/number-input'
import AdvancedMenu from '../components/menus-and-drawers/advanced-menu-collapse'
import HelpDrawer from '../components/menus-and-drawers/help-drawer'
import RadioSettings from '../components/inputs/bet-radio-settings'
import UMAIcon from '../components/icons-and-logos/uma-icon'
import NoSsr from '../components/icons-and-logos/no-ssr'
import VoxelDog from '../components/icons-and-logos/voxel-img'
import DatePicker from '../components/inputs/date-picker'

import contractConnection from '../utils/contractConnection'

import erc20ABI from '../utils/abis/erc20ABI.json'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const SetBet = () => {
    const [bet, setBet] = useState('')
    const [collateral, setCollateral] = useState('')
    const [expiry, setExpiry] = useState(Date.now())
    const [expiryInput, setExpiryInput] = useState("")
    const [betSize, setBetSize] = useState(0)
    const [validationReward, setValidationReward] = useState('0')
    const [livenessPeriod, setLivenessPeriod] = useState('0')
    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')
    const [counterParty, setCounterParty] = useState('0x0000000000000000000000000000000000000000')
    const [counterBet, setCounterBet] = useState(0)

    console.log(expiry)

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
        isOpen: isOpenDatePicker,
        onOpen: onOpenDatePicker,
        onClose: onCloseDatePicker
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
        console.log(betSide)
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

                <Flex direction="row" justify="space-between">
                    <Stack direction="column" spacing={0} w={400}>
                        <Heading>Collateral</Heading>
                        <Input bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="Collateral token address" onChange={handleCollateralChange} />
                    </Stack>
                    <Stack direction="column" justify="center" spacing={0} w={300} mb={4}>
                        <Stack direction="row" align="baseline">
                            <Heading>Expiry</Heading>
                            <Text bg="rgba(255, 73, 147, 0.2)" px={1.5} fontSize={14} borderTopRadius={10}>
                                {new Date(expiry).toLocaleDateString() != "Invalid Date" ? new Date(expiry).toLocaleDateString() : "Date out"} {new Date(expiry).toLocaleTimeString() != "Invalid Date" ? new Date(expiry).toLocaleTimeString() : "of range"}
                            </Text>
                        </Stack>
                        <Stack direction="row">
                            <Input bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="Unix Epoch" value={expiryInput} onChange={(e) => {
                                setExpiryInput(e.target.value)
                                setExpiry(Number(e.target.value))
                            }}></Input>
                            <Button onClick={onOpenDatePicker} bg="#FF4993"><CalendarIcon /></Button>
                        </Stack>
                        <Modal isOpen={isOpenDatePicker} onOverlayClick={() => { onCloseDatePicker() }}>
                            <ModalOverlay />
                            <ModalContent>
                                <Stack direction="row">
                                    <DatePicker expiry={expiry} setExpiry={setExpiry} setExpiryInput={setExpiryInput} />
                                </Stack>
                            </ModalContent>
                        </Modal>z
                    </Stack>
                </Flex>

                <NumInput headingText={"Bet Size"} onChange={setBetSize} />

                <Collapse in={isOpenAdvancedMenu} animateOpacity>
                    <AdvancedMenu onToggleAdvancedMenu={onToggleAdvancedMenu} setValidationReward={setValidationReward} setLivenessPeriod={setLivenessPeriod} />
                </Collapse>

                <Stack>
                    <RadioSettings betPrivacy={betPrivacy} handleBetPrivacy={handleBetPrivacy} betSide={betSide} setBetSide={setBetSide} />
                </Stack>

                <Collapse in={isOpenCounterparty} animateOpacity>
                    <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" />
                    <Box bg="rgba(255, 73, 147, 0.2)" px={2}>
                        <Heading pt={1}>Counterparty</Heading>
                        <Input bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your Counterparty's address" onChange={handleCounterpartyChange} />
                    </Box>
                    <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" mb={2} />
                </Collapse>

                <Box mt={4}>
                    <NumInput headingText={"Counter Bet"} onChange={setCounterBet} />
                </Box>

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
