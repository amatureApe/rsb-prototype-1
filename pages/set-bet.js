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
import RadioButton from '../components/inputs/radio-input'
import HelpAccordion from '../components/help-menu-accordion'

const SetBet = () => {
    const [bet, setBet] = useState('')
    const [collateral, setCollateral] = useState('')
    const [betSize, setBetSize] = useState(0)
    const [validationReward, setValidationReward] = useState('')
    const [livenessPeriod, setLivenessPeriod] = useState(0)
    const [betPrivacy, setBetPrivacy] = useState('1')
    const [betSide, setBetSide] = useState('1')
    const [counterBet, setCounterBet] = useState(0)

    const {
        isOpen: isOpenAdvancedMenu,
        onToggle: onToggleAdvancedMenu
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

    const handleCollateralChange = (e) => {
        let value = e.target.value
        setCollateral(value)
    }

    console.log(isOpenAdvancedMenu)


    return (
        <Layout title="Set Bet" >
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
                <HStack>
                    <Text fontSize={18} bg="rgba(255, 73, 147, 0.2)" px={2} cursor="pointer" onClick={onToggleAdvancedMenu}>Advanced <ChevronUpIcon /></Text>
                </HStack>
                <Box bg="rgba(255, 73, 147, 0.2)">
                    <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" mb={2} />
                    <NumInput headingText={"Validation Reward"} headingSize={28} onChange={setValidationReward} />
                    <NumInput headingText={"Liveness Period"} headingSize={28} onChange={setLivenessPeriod} />
                    <Divider orientation='horizontal' bg="#FF4993" borderWidth="1px" mb={2} />
                </Box>
            </Collapse>

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
            <Drawer
                isOpen={isOpenHelpDrawer}
                placement='right'
                onClose={onToggleHelpDrawer}
                finalFocusRef={helpBtnRef}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent bg={useColorModeValue("#f0e7db", "#202023")} borderLeft="1px" borderColor="#FF4993">
                    <DrawerCloseButton />
                    <DrawerHeader>Ready Set Bet</DrawerHeader>
                    <Text p={4}>Welcome to Ready Set Bet. Below are the explanations for the different input parameters. Enjoy responsibly.</Text>

                    <DrawerBody>
                        <HelpAccordion />
                    </DrawerBody>

                    <DrawerFooter>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Layout >
    )
}

export default SetBet
