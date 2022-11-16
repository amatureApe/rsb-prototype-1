import Link from 'next/link'
import Image from 'next/image'
import { Text, useColorModeValue, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'

const Logo = () => {
    const lazyApeImg = `/images/rsb${useColorModeValue('-light', '-dark')}.png`
    return (
        <Link href="/" scroll={false}>
            <Flex alignItems="center" justifyContent="center" fontWeight="bold" fontSize="18px" h={30} p={5}>
                <Image src={lazyApeImg} width={225} height={25} alt="logo" />
                <Text
                    color={useColorModeValue('gray.800', 'whiteAlpha.900')}
                    fontFamily='M PLUS Rounded 1c'
                    fontWeight="bold"
                    ml={3}
                >
                </Text>
            </Flex>
        </Link>
    )
}

export default Logo