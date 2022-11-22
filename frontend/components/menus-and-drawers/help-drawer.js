import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    Text,
    DrawerBody,
    DrawerFooter,
    useColorModeValue
} from '@chakra-ui/react'
import HelpAccordion from './help-menu-accordion'

const HelpDrawer = ({ isOpenHelpDrawer, onToggleHelpDrawer, helpBtnRef }) => {
    return (
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
    )
}

export default HelpDrawer