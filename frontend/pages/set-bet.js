import React from 'react'
import { useState, useRef } from 'react'
import { prepareSetBet, prepareLoadBet } from '../utils/dataPrep'

import {
    Container,
    Heading,
    Textarea,
    Input,
    Box,
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
    useToast,
    useDisclosure,
    useColorModeValue
} from '@chakra-ui/react'

import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons'

import { LeapFrog } from '@uiball/loaders'

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
import { checkApproval, approve } from '../utils/checkApproval'
import { WEEK_IN_SECONDS } from '../consts'

import handler from '../../smart-contracts/deployments/goerli/OO_BetHandler.json'

const SetBet = ({ accounts, chainId }) => {
    const [bet, setBet] = useState('')
    const [specifications, setSpecifications] = useState('')
    const [bond, setBond] = useState('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6')
    const [bondInput, setBondInput] = useState('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6')

    console.log(bond)

    const [affirmation, setAffirmation] = useState("0x0000000000000000000000000000000000000000")
    const [affirmationCollateral, setAffirmationCollateral] = useState("0x0000000000000000000000000000000000000000")
    const [affirmationAmount, setAffirmationAmount] = useState("")

    const [negation, setNegation] = useState("0x0000000000000000000000000000000000000000")
    const [negationCollateral, setNegationCollateral] = useState("0x0000000000000000000000000000000000000000")
    const [negationAmount, setNegationAmount] = useState("")

    const [expiry, setExpiry] = useState(milliToSec(Date.now()))
    const [expiryInput, setExpiryInput] = useState("")

    const [validationReward, setValidationReward] = useState('0')
    const [livenessPeriod, setLivenessPeriod] = useState('30')

    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')

    const [imgUrl, setImgUrl] = useState("./images/rsb-icon-pink-bgIvory.png")

    const toast = useToast()

    const customToast = (heading, message, type) => {
        const id = toast({
            position: 'top-left',
            duration: type === 'success' ? 10000 : null,
            render: function renderToast() {
                return (
                    <Box borderRadius={10} borderWidth='3px' borderColor={useColorModeValue('blackAlpha.700', '#FF4993')} p={1}>
                        <Box bg={useColorModeValue('#f0e7db', '#202023')} borderRadius={10}>
                            <Stack bg={useColorModeValue('rgba(255, 73, 147, 0.9)', 'rgba(255, 73, 147, 0.3)')} p={3} borderRadius={10}>
                                <Stack direction="row" justify="space-between">
                                    {
                                        type === 'pending' ?
                                            (
                                                <Stack direction="row">
                                                    <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>
                                                    <LeapFrog size={30} color='white' />
                                                </Stack>
                                            ) : (
                                                <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>

                                            )}
                                    <Button size="xs" variant="ghost" onClick={() => toast.close(id)}> <CloseIcon /></Button>
                                </Stack>
                                <Text color='whiteAlpha.900'>{message}</Text>
                            </Stack>
                        </Box>
                    </Box >
                )
            }
        })

        return id
    }

    const updateToast = (id, heading, message, type) => {
        if (toast.isActive(id)) {
            toast.update(id, {
                duration: type === 'success' ? 10000 : null,
                render: function renderToast() {
                    return (
                        <Box borderRadius={10} borderWidth='3px' borderColor={useColorModeValue('blackAlpha.700', '#FF4993')} p={1}>
                            <Box bg={useColorModeValue('#f0e7db', '#202023')} borderRadius={10}>
                                <Stack bg={useColorModeValue('rgba(255, 73, 147, 0.9)', 'rgba(255, 73, 147, 0.3)')} p={3} borderRadius={10}>
                                    <Stack direction="row" justify="space-between">
                                        {
                                            type === 'pending' ?
                                                (
                                                    <Stack direction="row">
                                                        <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>
                                                        <LeapFrog size={30} color='white' />
                                                    </Stack>
                                                ) : (
                                                    <Heading fontSize={22} color='whiteAlpha.900'>{heading}</Heading>

                                                )}
                                        <Button size="xs" variant="ghost" onClick={() => toast.close(id)}> <CloseIcon /></Button>
                                    </Stack>
                                    <Text color='whiteAlpha.900'>{message}</Text>
                                </Stack>
                            </Box>
                        </Box >
                    )
                }
            })
        }
        else {
            customToast(heading, message, type)
        }
    }

    const setBetArgs = [
        bet,
        specifications,
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
        onToggle: onToggleHelpDrawer
    } = useDisclosure()
    const helpBtnRef = useRef()

    const {
        isOpen: isOpenSpecifications,
        onToggle: onToggleSpecifications
    } = useDisclosure()

    const handleBetChange = (e) => {
        let value = e.target.value
        setBet(value)
    }

    const handleSpecificationsChange = (e) => {
        let value = e.target.value
        setSpecifications(value)
    }

    const handleBetPrivacy = (betPrivacy) => {
        setBetPrivacy(betPrivacy)
    }

    const handleSetBet = async () => {
        const contract = await contractConnection(handler.address, handler.abi)
        try {
            const id = customToast('Pending!', 'SetBet Tx is being confirmed', 'pending')
            const setBetTx = await contract.setBet(...prepareSetBet(...setBetArgs))

            const setBetTxReceipt = await setBetTx.wait()
            updateToast(id, 'Success!', 'SetBet Tx has been confirmed', 'success')

            const betId = setBetTxReceipt.logs[0].topics[2]

            const isApproved = await checkApproval(betSide === '1' ? affirmationCollateral : negationCollateral, handler.address, accounts)
            if (isApproved === false) {
                const id2 = customToast('Approving!', 'Token approval is being confirmed', 'pending')
                const approveTx = await approve(betSide === '1' ? affirmationCollateral : negationCollateral, handler.address)
                updateToast(id2, 'Approved!', 'Token has been approved', 'success')
            }

            const loadBetTx = await contract.loadBet(...prepareLoadBet(betId, ...loadBetArgs))
            const id3 = customToast('Pending!', 'LoadBet Tx is being confirmed', 'pending')

            await loadBetTx.wait()
            updateToast(id3, 'Success!', 'LoadBet Tx has been confirmed', 'success')
        } catch (error) {
            customToast('Error!', error.message.toString(), 'error')
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
                    <Textarea bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="What do you want to bet?" onChange={handleBetChange} />
                    <Stack direction="row" justify="flex-end">
                        <Button ref={helpBtnRef} onClick={onToggleSpecifications} variant="ghost" colorScheme="pink" mt={-4}>Specifications {isOpenSpecifications ? <ChevronUpIcon /> : <ChevronDownIcon />}</Button>
                    </Stack>
                    {isOpenSpecifications ?
                        <Stack mb={4}>
                            <Heading mt={-8}>Bet Specifications</Heading>
                            <Textarea bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Add your bet specifications here" onChange={handleSpecificationsChange} />
                        </Stack> :
                        <Box></Box>
                    }
                    <Stack>
                        <Stack direction="row" mt={isOpenSpecifications ? 0 : -8}>
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
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <RadioSettings betPrivacy={betPrivacy} handleBetPrivacy={handleBetPrivacy} betSide={betSide} setBetSide={setBetSide} />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <BondInput chainId={chainId} setBond={setBond} bond={bond} bondInput={bondInput} setBondInput={setBondInput} />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <Expiry expiry={expiry} setExpiry={setExpiry} expiryInput={expiryInput} setExpiryInput={setExpiryInput} isOpenDatePicker={isOpenDatePicker} onCloseDatePicker={onCloseDatePicker} onOpenDatePicker={onOpenDatePicker} />
                                        </TabPanel>
                                        <TabPanel borderRadius={10} borderWidth="1px" borderColor="#FF4993">
                                            <AdvancedMenu setValidationReward={setValidationReward} setLivenessPeriod={setLivenessPeriod} />
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
