import { Stack, Heading, Text, Input, Button, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react"
import { CalendarIcon } from "@chakra-ui/icons"
import DatePicker from "./date-picker"
import NoSsr from "../icons-and-logos/no-ssr"


const Expiry = ({ expiry, setExpiry, expiryInput, setExpiryInput, isOpenDatePicker, onCloseDatePicker, onOpenDatePicker }) => {
    return (
        <Stack bg="rgba(255, 73, 147, 0.2)" borderRadius={10}>
            <NoSsr>
                <Stack direction="column" justify="center" spacing={0} h={135} p={2} borderRadius={10} mx={5}>
                    <Stack direction="row" align="baseline">
                        <Heading>Expiry</Heading>
                        <Text px={1.5} fontSize={14} borderTopRadius={10}>
                            {new Date(expiry).toLocaleDateString() != "Invalid Date" ? new Date(expiry).toLocaleDateString() : "Date out"} {new Date(expiry).toLocaleTimeString() != "Invalid Date" ? new Date(expiry).toLocaleTimeString() : "of range"}
                        </Text>
                    </Stack>
                    <Stack direction="row">
                        <Input bg="whiteAlpha.800" color="#525252" borderWidth="1px" borderColor="#FF4993" _placeholder={{ color: "#525252" }} placeholder="Unix Epoch" value={expiryInput} onChange={(e) => {
                            setExpiryInput(e.target.value)
                            setExpiry(Number(e.target.value))
                        }}></Input>
                        <Button onClick={onOpenDatePicker} bg="#FF4993"><CalendarIcon /></Button>
                    </Stack>
                    <Modal isOpen={isOpenDatePicker} onOverlayClick={() => { onCloseDatePicker() }}>
                        <ModalOverlay />
                        <ModalContent borderRadius={20}>
                            <Stack direction="row">
                                <DatePicker expiry={expiry} setExpiry={setExpiry} setExpiryInput={setExpiryInput} />
                            </Stack>
                        </ModalContent>
                    </Modal>
                </Stack>
            </NoSsr>
        </Stack>
    )
}

export default Expiry