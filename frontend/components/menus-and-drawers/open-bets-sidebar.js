import {
    useDisclosure,
    useColorModeValue,
    Button,
    Box,
    Text,
    Container,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Sidebar({ getButtonProps, getDisclosureProps, isOpen, hidden, setHidden }) {

    return (
        <Box>
            <motion.div
                {...getDisclosureProps()}
                hidden={hidden}
                initial={false}
                onAnimationStart={() => setHidden(false)}
                onAnimationComplete={() => setHidden(!isOpen)}
                animate={{ width: isOpen ? 225 : 0 }}
                style={{
                    background: 'red',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    // position: 'absolute',
                    right: '0',
                    height: '100%',
                    top: '0',
                    backgroundColor: useColorModeValue('#f0e7db', '#2d3649'),
                    borderWidth: '1px',
                    borderColor: '#FF4993',
                    borderRadius: '10px'
                }}
            >
                <Container>
                    <Accordion allowToggle>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Section 1 title
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

                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Section 2 title
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <Button>Hello</Button>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Container>
            </motion.div>
        </Box>
    )
}