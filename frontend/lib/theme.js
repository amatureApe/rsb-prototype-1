import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
    global: props => ({
        body: {
            bg: mode('#f0e7db', '#202023')(props)
        },
        heading: {
            color: mode('#3D4950', '#FFFFFF')(props)
        }
    })
}

const components = {
    Heading: {
        variants: {
            'section-title': {
                textDecoration: 'underline',
                fontSize: 20,
                textUnderlineOffset: 6,
                textDecorationColor: '#525252',
                textDecorationThickness: 4,
                marginTop: 3,
                marginBottom: 4
            }
        }
    },
    Link: {
        baseStyle: props => ({
            color: mode('#3d7aed', '#ff63c3')(props),
            textUnderlineOffset: 3
        })
    },
    Tooltip: {
        colorScheme: {
            green: {
                color: "white",
                bg: "green.500",
                borderColor: "green.500",
            },
        }
    }
}

const fonts = {
    heading: `'Open Sans', sans-serif`,
    // body: `'Raleway', sans-serif`,
}

const colors = {
    grassTeal: '#88ccca'
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false
}

const theme = extendTheme({ config, styles, components, fonts, colors })
export default theme