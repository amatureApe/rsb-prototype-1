import {
    Container,
    Heading,
    Textarea,
    Input,
    Button,
    Box,
    Flex,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Stack,
    HStack,
    Text,
    Divider,
    Collapse,
    useDisclosure,
    useColorModeValue
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import Layout from '../components/layout/article'
import React from 'react'
import { useState, useRef } from 'react'
import NumInput from '../components/inputs/number-input'
import AdvancedMenu from '../components/menus-and-drawers/advanced-menu-collapse'
import HelpDrawer from '../components/menus-and-drawers/help-drawer'
import RadioSettings from '../components/inputs/bet-radio-settings'

const SetBet = () => {
    const [bet, setBet] = useState('')
    const [collateral, setCollateral] = useState('')
    const [betSize, setBetSize] = useState(0)
    const [validationReward, setValidationReward] = useState('')
    const [livenessPeriod, setLivenessPeriod] = useState(0)
    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')
    const [counterParty, setCounterParty] = useState('')
    const [counterBet, setCounterBet] = useState(0)

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

    console.log(betPrivacy)


    return (
        <Layout title="Set Bet">

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
                    <Heading>Counterparty</Heading>
                    <Input bg="whiteAlpha.800" color="#525252" mb={4} _placeholder={{ color: "#525252" }} placeholder="Input your Counterparty's address" onChange={setCounterParty} />
                </Box>
                <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" mb={2} />
            </Collapse>

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

            <HelpDrawer isOpenHelpDrawer={isOpenHelpDrawer} onToggleHelpDrawer={onToggleHelpDrawer} helpBtnRef={helpBtnRef} />
        </Layout >
    )
}

export default SetBet
