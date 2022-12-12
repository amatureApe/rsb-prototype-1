import React from 'react'
import dynamic from "next/dynamic"
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
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Switch,
    Divider,
    Collapse,
    Image,
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
import BetAmounts from '../components/inputs/bet-amounts'
import BondInput from '../components/inputs/bond-input'

import contractConnection from '../utils/contractConnection'

import erc20ABI from '../utils/abis/erc20ABI.json'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const SetBet = () => {
    const [bet, setBet] = useState('')
    const [collateral, setCollateral] = useState('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6')
    const [collateralSide, setCollateralSide] = useState(true)
    const [affirmation, setAffirmation] = useState("0x0000000000000000000000000000000000000000")
    const [affirmationToken, setAffirmationToken] = useState("0x0000000000000000000000000000000000000000")
    const [negation, setNegation] = useState("0x0000000000000000000000000000000000000000")
    const [negationToken, setNegationToken] = useState("0x0000000000000000000000000000000000000000")
    const [expiry, setExpiry] = useState(Date.now())
    const [expiryInput, setExpiryInput] = useState("")
    const [betSize, setBetSize] = useState(0)
    const [validationReward, setValidationReward] = useState('0')
    const [livenessPeriod, setLivenessPeriod] = useState('30')
    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')
    const [counterParty, setCounterParty] = useState('0x0000000000000000000000000000000000000000')
    const [counterBet, setCounterBet] = useState(0)
    const [imgUrl, setImgUrl] = useState("./images/rsb-icon-pink-bgIvory.png")

    console.log(betSide)

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
        if (collateralSide)
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
                <Stack spacing={5}>
                    <Stack justify="space-between" direction="row" align="flex-end" mb={-4}>
                        <Heading>Your Bet</Heading>
                        {betSide == '1' ? (
                            <Badge colorScheme="green" fontSize={28} borderRadius={20} px={2}>Affirmation</Badge>
                        ) : (
                            <Badge colorScheme="red" fontSize={28} borderRadius={20} px={2}>Negation</Badge>

                        )}
                        <Button ref={helpBtnRef} onClick={onToggleHelpDrawer} m={2} variant="ghost" colorScheme="pink">Need Help?</Button>
                    </Stack>
                    <Textarea bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" mb={4} _placeholder={{ color: "#525252" }} placeholder="What do you want to bet?" onChange={handleBetChange} />

                    <Flex direction="row" justify="space-between">
                        <Stack direction="column" spacing={0} w={400} justify="flex-end">
                            <Stack direction="row" align="center">
                                {collateralSide ? (
                                    <Badge colorScheme="green" variant={useColorModeValue("solid", "subtle")} borderTopRadius={15} px={1}>
                                        <Heading fontSize={24}>Collateral</Heading>
                                    </Badge>
                                ) : (
                                    <Spacer />
                                )}
                                <Switch colorScheme="pink" px={1.5} onChange={() => setCollateralSide(!collateralSide)} />
                                {!collateralSide ? (
                                    <Badge colorScheme="red" variant={useColorModeValue("solid", "subtle")} borderTopRadius={15} px={1}>
                                        <Heading fontSize={24}>Collateral</Heading>
                                    </Badge>
                                ) : (
                                    <Spacer />
                                )}
                            </Stack>
                            <Input bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Collateral token address" onChange={handleCollateralChange} />
                        </Stack>
                        <NoSsr>
                            <Stack direction="column" justify="center" spacing={0} w={300}>
                                <Stack direction="row" align="baseline">
                                    <Heading>Expiry</Heading>
                                    <Text bg="rgba(255, 73, 147, 0.2)" px={1.5} fontSize={14} borderTopRadius={10}>
                                        {new Date(expiry).toLocaleDateString() != "Invalid Date" ? new Date(expiry).toLocaleDateString() : "Date out"} {new Date(expiry).toLocaleTimeString() != "Invalid Date" ? new Date(expiry).toLocaleTimeString() : "of range"}
                                    </Text>
                                </Stack>
                                <Stack direction="row">
                                    <Input bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Unix Epoch" value={expiryInput} onChange={(e) => {
                                        setExpiryInput(e.target.value)
                                        setExpiry(Number(e.target.value))
                                    }}></Input>
                                    <Button onClick={onOpenDatePicker} bg="#FF4993"><CalendarIcon /></Button>
                                </Stack>
                                <Modal isOpen={isOpenDatePicker} onOverlayClick={() => { onCloseDatePicker() }}>
                                    <ModalOverlay />
                                    <ModalContent borderRadius={20}>
                                        <Stack direction="row">
                                            <DatePicker expiry={expiry} setExpiry={setExpiry} setExpiryInput={setExpiryInput} />
                                        </Stack>
                                    </ModalContent>
                                </Modal>
                            </Stack>
                        </NoSsr>
                    </Flex>

                    <Stack>
                        <Stack direction="row">
                            <Stack>
                                <Heading>Image</Heading>
                                <Stack borderWidth={1} borderColor="#FF4993" p={2} borderRadius={10}>
                                    <Image src={imgUrl} h={150} w={150} bg="rgba(255, 73, 147, 0.2)" p={2} borderRadius={10} />
                                </Stack>
                            </Stack>
                            <Stack w="75%">
                                <Tabs isFitted size="md" px={10}>
                                    <TabList mb={2}>
                                        <Tab color="#FF4993">Settings</Tab>
                                        <Tab color="#FF4993">Bond</Tab>
                                        <Tab color="#FF4993">Advanced</Tab>
                                        <Tab color="#FF4993">Dev</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <RadioSettings betPrivacy={betPrivacy} handleBetPrivacy={handleBetPrivacy} betSide={betSide} setBetSide={setBetSide} />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <BondInput />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <AdvancedMenu onToggleAdvancedMenu={onToggleAdvancedMenu} setValidationReward={setValidationReward} setLivenessPeriod={setLivenessPeriod} />
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

                    <BetAmounts />

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
