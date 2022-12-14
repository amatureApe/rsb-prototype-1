import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    Flex,
    Spacer
} from '@chakra-ui/react'

const HelpAccordion = () => {
    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            <Flex direction="column">
                <Flex direction="column">
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    <Text as="b">General</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            Ready Set Bet is a completely decentralized escrow and event validation platform.
                            Built on the UMA protocol, virtually any event, question, or query you would like to
                            validate can be done so by Ready Set Bet.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    Your Bet
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            Ready Set Bet can validate any query that is both understandable by humans and
                            publicly knowable. Any question from "Will Bitcoin hit $X USD by the end of 2023?" to
                            "Will Irvine, California reach 100°F sometime within the next 7 days?" to "Will the Jets win
                            the next SuperBowl?" and everything in between can be asked. There are two sides available for
                            each bet, the Affirmation and the Negation. The user may choose whether they want to affirm or
                            negate the bet contract as specified in the wording. The opposite side will become available for
                            purchase on the open market.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    Image
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            An image can also be added to your bet contract. The image will be displayed in a
                            100px by 100px format. Add an image to make your contract standout to potential
                            counterparties. If a no image url is input, a default image will be selected.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    Settings
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            The settings tab allows for a users to select the preferred bet privacy and bet side.
                            A public assign the user to their preferred side and leave the counterparty position open to be
                            purchased by another interested a party. For a private bet, the user will have to manually choose
                            their side in addition to explicitly choosing a counterparty address.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    Bond
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            The UMA protocol requires a bond currency to be deposited as payment for the validation process.
                            The amount of the bond currency that is needed for each bet to be validated varies depending on
                            the specific collateral token. For more information please refer to the UMA documentation.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    Expiry
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            Users are able to add an expiry timestamp for their bets. The expiry timestamp uses the UTC
                            Unix Epoch format rounded to the nearest second. The expiry timestamp represents the minimum
                            epoch by which the bet is able to be settled by UMA. For example, a bet such as "Will the S&P 500
                            drop more than 5% by the end of 2022?" should have its is expiry timestamp be set to 1672531200,
                            or Jan 1st 2023 12:00AM UTC. This will prevent users from unnecessarily requesting bet validation
                            before it is settleable.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    Collateral Tokens
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            The Ready Set Bet protocol allows for users to assign custom collateral tokens for the bet. A bet
                            can either have both the affirmation and the negation use the same token or different tokens. Ready
                            Set Bet is compatible with any ERC20 token, however, more obscure tokens may not have the same
                            quality of information available.
                        </AccordionPanel>
                    </AccordionItem>
                </Flex>

                <Spacer mt={10} />
                <Text>Advanced Settings</Text>

                <Flex direction="column">
                    <AccordionItem mb={1}>
                        <h2>
                            <AccordionButton bg="rgba(255, 73, 147, 0.3)" _hover={{ bg: "rgba(255, 73, 147, 0.2)" }}>
                                <Box flex='1' textAlign='left'>
                                    Validation Reward
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            The validation reward is an additional reward given to UMA validators beyond the standard
                            bond fee. While optional, it is recommended to add extra validation rewards for bets that
                            are either handling large sums of money or are complex enough in nature to warrant additional
                            fees. Keep in mind that the UMA protocol utilizes game theory tokenomics to incentivize humans
                            to validate your questions. Make sure to pay enough to make it worth a human's time to validate
                            your request. Refer to the UMA documentation for more information.
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem >
                        <h2>
                            <AccordionButton bg="rgba(255, 73, 147, 0.3)" _hover={{ bg: "rgba(255, 73, 147, 0.2)" }}>
                                <Box flex='1' textAlign='left'>
                                    Liveness Period
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            The liveness period is the amount of time, measured in seconds, that is available for dispute
                            resolution for the validation process. UMA recommends a standard 2 hour liveness period for most
                            requests, however the user is able to change this parameter for their specific needs. Contracts on
                            a shorter timeframe that are not handling large sums of money may utilize a shorter liveness period
                            and contracts handling large sums of money may be better suited with a longer dispute resolution period.
                            After a bet contract has been validated, users will need to wait the length of the liveness period
                            before they are able to settle the contract and claim their funds. For more information please refer to
                            the UMA documentation.
                        </AccordionPanel>
                    </AccordionItem>
                </Flex>

                <Spacer mt={10} />
                <Text>More</Text>

                <Flex direction="column">
                    <AccordionItem mb={1}>
                        <h2>
                            <AccordionButton bg="rgba(251, 76, 76, 0.3)" _hover={{ bg: "rgba(251, 76, 76, 0.2)" }}>
                                <Box flex='1' textAlign='left'>
                                    UMA Protocol
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            UMA is a thoroughly audited and battle-tested optimistic oracle and dispute arbitration system that securely allows for arbitrary types
                            of data to be brought on-chain. UMA's oracle system provides data for projects including a cross-chain bridge, insurance protocols, custom derivatives
                            and prediction markets. At Ready Set Bet, the UMA oracle is used as the main method of bet validation. For more information about the UMA protocol, please
                            refer to the UMA documentation.
                        </AccordionPanel>
                    </AccordionItem>
                </Flex>
            </Flex>
        </Accordion >
    )
}

export default HelpAccordion