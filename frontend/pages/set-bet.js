import React from 'react'
import { useState, useRef } from 'react'
import { prepareSetBet, prepareLoadBet } from '../utils/dataPrep'

import {
    Container,
    Heading,
    Textarea,
    Input,
    Button,
    Stack,
    HStack,
    Text,
    Badge,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Image,
    useDisclosure,
    useColorModeValue
} from '@chakra-ui/react'

import Layout from '../components/layout/article'
import AdvancedMenu from '../components/menus-and-drawers/advanced-menu-collapse'
import HelpDrawer from '../components/menus-and-drawers/help-drawer'
import RadioSettings from '../components/inputs/bet-radio-settings'
import UMAIcon from '../components/icons-and-logos/uma-icon'
import BetAmounts from '../components/inputs/bet-amounts'
import BondInput from '../components/inputs/bond-input'
import Expiry from '../components/inputs/expiry'
import CollateralInputs from '../components/inputs/collateral-inputs'
import ParticipantInputs from '../components/inputs/participant-inputs'

import { milliToSec } from '../utils/date-picker-funcs'

import contractConnection from '../utils/contractConnection'
import checkApproval from '../utils/checkApproval'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const SetBet = ({ accounts }) => {
    const [bet, setBet] = useState('')
    const [bond, setBond] = useState('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6')
    const [bondInput, setBondInput] = useState("")

    const [affirmation, setAffirmation] = useState("0x0000000000000000000000000000000000000000")
    const [affirmationCollateral, setAffirmationCollateral] = useState("0x0000000000000000000000000000000000000000")
    const [affirmationAmount, setAffirmationAmount] = useState("0.01")

    const [negation, setNegation] = useState("0x0000000000000000000000000000000000000000")
    const [negationCollateral, setNegationCollateral] = useState("0x0000000000000000000000000000000000000000")
    const [negationAmount, setNegationAmount] = useState("0.01")

    const [expiry, setExpiry] = useState(milliToSec(Date.now()))
    const [expiryInput, setExpiryInput] = useState("")

    const [validationReward, setValidationReward] = useState('0')
    const [livenessPeriod, setLivenessPeriod] = useState('30')

    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')

    const [imgUrl, setImgUrl] = useState("./images/rsb-icon-pink-bgIvory.png")

    const setBetArgs = [
        bet,
        expiry,
        bond,
        livenessPeriod,
        validationReward,
        betPrivacy,
        imgUrl
    ]

    const loadBetArgs = [
        betSide,
        accounts,
        betPrivacy,
        affirmation,
        affirmationCollateral,
        affirmationAmount,
        negation,
        negationCollateral,
        negationAmount
    ]

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
    }

    const handleSetBet = async () => {
        const contract = await contractConnection(handler.address, handler.abi)
        try {
            const setBetTx = await contract.setBet(...prepareSetBet(...setBetArgs))
            const setBetTxReceipt = await setBetTx.wait()
            const betId = setBetTxReceipt.logs[0].topics[2]

            await checkApproval(betSide === '1' ? affirmationCollateral : negationCollateral, handler.address)

            const loadBetTx = await contract.loadBet(...prepareLoadBet(betId, ...loadBetArgs))
            loadBetTx.wait()

        } catch (err) {
            console.log("error: ", err)
        }
    }

    return (
        <Layout title="Set Bet">
            <Container maxW="container.md">
                <Stack spacing={5}>
                    <Stack justify="space-between" direction="row" align="flex-end" mb={-4}>
                        <Heading>Your Bet</Heading>
                        {betSide == '1' ? (
                            <Badge colorScheme="green" fontSize={28} borderRadius={20} px={2} variant={useColorModeValue("solid", "subtle")}>Affirmation</Badge>
                        ) : (
                            <Badge colorScheme="red" fontSize={28} borderRadius={20} px={2} variant={useColorModeValue("solid", "subtle")}>Negation</Badge>

                        )}
                        <Button ref={helpBtnRef} onClick={onToggleHelpDrawer} m={2} variant="ghost" colorScheme="pink">Need Help?</Button>
                    </Stack>
                    <Textarea bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" mb={4} _placeholder={{ color: "#525252" }} placeholder="What do you want to bet?" onChange={handleBetChange} />

                    <Stack>
                        <Stack direction="row">
                            <Stack>
                                <Heading>Image</Heading>
                                <Stack borderWidth={1} borderColor="#FF4993" p={2} borderRadius={10}>
                                    <Image src={imgUrl} h={150} w={150} bg="rgba(255, 73, 147, 0.2)" p={2} borderRadius={10} _active={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'all .1s ease'
                                    }} />
                                </Stack>
                            </Stack>
                            <Stack w="75%">
                                <Tabs isFitted size="md" pl={10}>
                                    <TabList mb={2}>
                                        <Tab color="#FF4993">Settings</Tab>
                                        <Tab color="#FF4993">Bond</Tab>
                                        <Tab color="#FF4993">Expiry</Tab>
                                        <Tab color="#FF4993">Advanced</Tab>
                                        <Tab color="#FF4993">Dev</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <RadioSettings betPrivacy={betPrivacy} handleBetPrivacy={handleBetPrivacy} betSide={betSide} setBetSide={setBetSide} />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <BondInput setBond={setBond} bond={bond} bondInput={bondInput} setBondInput={setBondInput} />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <Expiry expiry={expiry} setExpiry={setExpiry} expiryInput={expiryInput} setExpiryInput={setExpiryInput} isOpenDatePicker={isOpenDatePicker} onCloseDatePicker={onCloseDatePicker} onOpenDatePicker={onOpenDatePicker} />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <AdvancedMenu setValidationReward={setValidationReward} setLivenessPeriod={setLivenessPeriod} />
                                        </TabPanel>
                                        <TabPanel>
                                            Hello
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Stack>
                        </Stack>
                        <Input placeholder="Image url" color="rgb(82, 82, 82)" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} bg="whiteAlpha.800" onChange={(e) => setImgUrl(e.target.value)} />
                    </Stack>

                    <ParticipantInputs betPrivacy={betPrivacy} betSide={betSide} setAffirmation={setAffirmation} setNegation={setNegation} />

                    <CollateralInputs setAffirmationCollateral={setAffirmationCollateral} setNegationCollateral={setNegationCollateral} />

                    <BetAmounts setAffirmationAmount={setAffirmationAmount} setNegationAmount={setNegationAmount} />

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
                </Stack>
            </Container>
        </Layout >
    )
}

export default SetBet
