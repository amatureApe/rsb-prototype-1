import { Box, Image, Link } from '@chakra-ui/react'
const UMALogo = `/images/uma-icon.svg`

const UMAIcon = () => {
    return (
        <Box pr={2}>
            <Link href="https://docs.umaproject.org/" isExternal>
                <Image h={7} src={UMALogo} />
            </Link>
        </Box>
    )
}

export default UMAIcon
