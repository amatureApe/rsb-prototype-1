import { useState } from 'react'
import {
    useDisclosure,
    useColorModeValue,
    Button,
    Box,
    Text,
    Stack,
    Divider,
    Input,
    Container,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react'

import { Search2Icon } from '@chakra-ui/icons'

import { motion } from 'framer-motion'

export default function Sidebar({ searchById, setSearchParams, getButtonProps, getDisclosureProps, isOpen, hidden, setHidden }) {

    return (
        <Box>
            <motion.div
                {...getDisclosureProps()}
                hidden={hidden}
                initial={false}
                onAnimationStart={() => setHidden(false)}
                onAnimationComplete={() => setHidden(!isOpen)}
                animate={{ width: isOpen ? 300 : 0 }}
                style={{
                    background: 'red',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    // position: 'absolute',
                    right: '0',
                    height: '100%',
                    top: '0',
                    backgroundColor: useColorModeValue('#f0e7db', '#202023'),
                    borderWidth: '1px',
                    borderColor: '#FF4993',
                    borderRadius: '10px'
                }}
            >
                <Container>
                    <Accordion allowToggle mb={10}>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Bet Id
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Stack direction="row">
                                    <NumberInput size='sm' bg="whiteAlpha.700" color="#525252" defaultValue={0} min={0} onChange={setSearchParams}>
                                        <NumberInputField />
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
                                                children='-' />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <Button size='sm' bg='#FF4993' onClick={searchById}><Search2Icon color='whiteAlpha.900' /></Button>
                                </Stack>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Participants
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Text fontSize={10}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Volume
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Button>Hello</Button>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Collateral Type
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Text fontSize={10}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Size & Odds
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Text fontSize={10}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Status
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Text fontSize={10}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Expiration
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Text fontSize={10}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderBottomWidth='1px' borderBottomColor='#FF4993'>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Tags
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Text fontSize={10}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Container>
            </motion.div>
        </Box >
    )
}