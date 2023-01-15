
import { Box, Stack, Input, Heading, RadioGroup, Radio, Link, Spacer, useColorModeValue } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { COLLATERAL_ADDRESSES } from '../../consts'


const BondInput = ({ chainId, setBond, bond, bondInput, setBondInput }) => {
    const resetBondInput = () => {
        setBondInput("")
    }

    const handleBondInput = (e) => {
        setBond(e)
        setBondInput(e)
    }

    return (
        <Box bg="rgba(255, 73, 147, 0.2)" borderRadius={10}>
            <Stack direction="column" h={135} p={2} borderRadius={10} justify="center">
                <Box px={5}>
                    <Heading fontSize={24}>Bond</Heading>
                    <Input
                        bg="whiteAlpha.800"
                        color="#525252"
                        borderWidth="1px"
                        borderColor="#FF4993"
                        borderBottomRadius={0}
                        _placeholder={{ color: "#525252" }}
                        placeholder="Collateral token address"
                        value={bondInput}
                        onChange={(e) => {
                            setBond(e.target.value)
                            setBondInput(e.target.value)
                        }} />
                    <RadioGroup
                        onChange={handleBondInput}
                        value={bond}
                        bg={useColorModeValue('#f0e7db', '#202023')}
                        px={2}
                        borderBottomRadius={15}
                        borderWidth="1px"
                        borderTopWidth={0}
                        borderColor="#FF4993"
                    >
                        <Stack direction="row" align="center">
                            <Stack direction='row'>
                                <Radio value={COLLATERAL_ADDRESSES[chainId]['weth']} colorScheme="pink">wETH</Radio>
                                <Radio value={COLLATERAL_ADDRESSES[chainId]['wbtc']} colorScheme="pink">wBTC</Radio>
                                <Radio value={COLLATERAL_ADDRESSES[chainId]['dai']} colorScheme="pink">DAI</Radio>
                                <Radio value={COLLATERAL_ADDRESSES[chainId]['usdc']} colorScheme="pink">USDC</Radio>
                                <Radio value={COLLATERAL_ADDRESSES[chainId]['uma']} colorScheme="pink">UMA</Radio>
                            </Stack>
                            <Spacer />
                            <Stack>
                                <Link href="https://docs.umaproject.org/resources/approved-collateral-types" isExternal={true} mr={2} mt={1}>
                                    <ExternalLinkIcon marginInlineStart={0} />
                                </Link>
                                <Spacer />
                            </Stack>
                        </Stack>
                    </RadioGroup>
                </Box>
            </Stack >
        </Box >
    )
}

export default BondInput