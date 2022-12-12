
import { Box, Stack, Input, Heading, RadioGroup, Radio, Link, Spacer } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'


const BondInput = ({ setBond, bond, bondInput, setBondInput }) => {
    const resetBondInput = () => {
        setBondInput("")
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
                        _placeholder={{ color: "#525252" }}
                        placeholder="Collateral token address"
                        value={bondInput}
                        onChange={(e) => {
                            setBond(e.target.value)
                            setBondInput(e.target.value)
                        }} />
                    <RadioGroup onChange={setBond} value={bond} onClick={resetBondInput}>
                        <Stack direction="row" align="center">
                            <Stack direction='row'>
                                <Radio value='1' colorScheme="pink">WETH</Radio>
                                <Radio value='2' colorScheme="pink">WBTC</Radio>
                                <Radio value='3' colorScheme="pink">DAI</Radio>
                                <Radio value='4' colorScheme="pink">USDC</Radio>
                                <Radio value='5' colorScheme="pink">UMA</Radio>
                            </Stack>
                            <Stack>
                                <Link href="https://docs.umaproject.org/resources/approved-collateral-types" isExternal={true}>
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