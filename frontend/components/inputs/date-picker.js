import React, { useState } from 'react'
import { Box, Stack, Input, Text, Heading, Button, Grid, GridItem, Divider, Spacer, Collapse, Menu, MenuList, MenuItem, MenuButton, useDisclosure, Tr } from '@chakra-ui/react'
import { monthNames } from '../../consts'
import { getNumberOfDaysInMonth, getSortedDays, range } from '../../utils/date-picker-funcs'
import { ChevronLeftIcon, ChevronRightIcon, TimeIcon, RepeatClockIcon, NotAllowedIcon, CheckIcon } from '@chakra-ui/icons'

const DatePicker = ({ expiry, setExpiry, setExpiryInput }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(expiry).getMonth())
    const [currentYear, setCurrentYear] = useState(new Date(expiry).getFullYear())
    const [selectedDate, setSelectedDate] = useState(new Date(expiry))
    const [timestamp, setTimestamp] = useState(Date.now(expiry))
    const [converterTime, setConverterTime] = useState(new Date(Date.now()).toLocaleDateString())
    const [converterInputVal, setConverterInputVal] = useState("")

    const TRUE_TIME = Date.now()

    const {
        isOpen: isOpenConverter,
        onToggle: onToggleConverter
    } = useDisclosure()

    const nextMonth = () => {
        if (currentMonth < 11) {
            setCurrentMonth(prev => prev + 1)
        } else {
            setCurrentMonth(0)
            setCurrentYear(prev => prev + 1)
        }
    }

    const prevMonth = () => {
        if (currentMonth > 0) {
            setCurrentMonth(prev => prev - 1)
        } else {
            setCurrentMonth(11)
            setCurrentYear(prev => prev - 1)
        }
    }

    const handleSelection = (event) => {
        let day = event.target.value
        setSelectedDate(
            new Date(currentYear, currentMonth, day)
        )
        setTimestamp(Date.UTC(currentYear, currentMonth, day, 0))
        setExpiry(Date.UTC(currentYear, currentMonth, day, 0))
        setExpiryInput(Date.UTC(currentYear, currentMonth, day, 0).toString())
    }

    const setEpoch = () => {
        const time = Number(converterInputVal) > 0 ? Number(converterInputVal) : Date.now()
        setSelectedDate(new Date(time))
        setTimestamp(time)
        setExpiry(time)
        setExpiryInput(time.toString())
        setCurrentMonth(new Date(time).getMonth())
        setCurrentYear(new Date(time).getFullYear())
    }

    const handleConverterTime = (event) => {
        let time = event.target.value
        setConverterTime(Number(time))
        setConverterInputVal(time)
    }

    const handleConverterReset = () => {
        setConverterTime(Date.now())
        setConverterInputVal("")
    }

    const handleDateReset = () => {
        setSelectedDate(new Date())
        setTimestamp(Date.now())
        setCurrentMonth(new Date().getMonth())
        setCurrentYear(new Date().getFullYear())
    }

    // const getTimeFromState = (day) => {
    //     return new Date(currentYear, currentMonth, day).getTime()
    // }

    console.log("PING", converterInputVal)

    return (
        <Box borderRadius={10} w={500} bg="rgba(255, 73, 147, 0.2)" p={5}>
            <Box p={5} bg="#202023" borderRadius={10}>
                <Stack direction="row" justify="space-between" mb={4}>
                    <Button size="sm" color="#FF4993" onClick={prevMonth}>
                        <ChevronLeftIcon />
                    </Button>
                    <Stack direction="row" spacing={0}>
                        <Menu>
                            <MenuButton as={Button} variant="ghost">
                                <Heading fontSize={28}>{monthNames[currentMonth]}</Heading>
                            </MenuButton>
                            <MenuList bg="#202023" overflowY="scroll" h={300}>
                                {monthNames.map((month) => (
                                    <Box>
                                        <MenuItem bg="rgba(255, 73, 147, 0.4)" _hover={{ bg: "#202023" }} onClick={() => setCurrentMonth(monthNames.indexOf(month))}>{month}</MenuItem>
                                        <Divider />
                                    </Box>
                                ))}
                            </MenuList>
                        </Menu>
                        <Menu>
                            <MenuButton as={Button} variant="ghost">
                                <Heading fontSize={28}>{currentYear}</Heading>
                            </MenuButton>
                            <MenuList bg="#202023" overflowY="scroll" h={300}>
                                {range(new Date(TRUE_TIME).getFullYear(), new Date(TRUE_TIME).getFullYear() + 100).map((year) => (
                                    <Box>
                                        <MenuItem key={year} bg="rgba(255, 73, 147, 0.4)" _hover={{ bg: "#202023" }} onClick={() => { setCurrentYear(year) }}>{year}</MenuItem>
                                        <Divider />
                                    </Box>
                                ))}
                            </MenuList>
                        </Menu>
                    </Stack>
                    <Button size="sm" color="#FF4993" onClick={nextMonth}>
                        <ChevronRightIcon />
                    </Button>
                </Stack>
                <Box>
                    <Grid templateColumns='repeat(7, 1fr)' justifyItems="center" px={5}>
                        {getSortedDays(currentYear, currentMonth).map((day) => (
                            <GridItem>
                                <Heading fontSize="14px">{day}</Heading>
                            </GridItem>
                        ))}
                    </Grid>
                </Box>
                <Divider bg="#FF4993" mt={3} />
                <Box px={5} pt={2} mb={4}>
                    <Stack direction="row" justify="space-between" align="center" mb={2}>
                        <Stack direction="row" align="center" justify="center" spacing={0.5}>
                            <Text fontSize={14} bg="pink.800" borderRadius={10} px={1}>{timestamp}</Text>
                            <Button size="xs" h={3.5} _hover={{ bg: "none" }} _active={{ bg: "none" }} borderRadius={100} variant="ghost" onClick={handleDateReset}><RepeatClockIcon /></Button>
                        </Stack>
                        <Stack direction="row" align="center" justify="center" spacing={1}>
                            <Text fontSize={14}>Selected: </Text>
                            <Text color="#FF4993">{selectedDate.toLocaleDateString()}</Text>
                        </Stack>
                    </Stack>
                    <Grid templateColumns='repeat(7, 1fr)' gap={2} justifyItems="center">
                        {range(1, getNumberOfDaysInMonth(currentYear, currentMonth) + 1).map((day) => {
                            const year = currentYear
                            const month = currentMonth
                            return (
                                <GridItem>
                                    <Button
                                        color="whiteAlpha.900"
                                        bg="#FF4993"
                                        isActive={selectedDate.getDate() == day && selectedDate.getMonth() == month && selectedDate.getFullYear() == year ? true : false}
                                        _active={{
                                            bg: 'pink.800',
                                            transform: 'scale(1.15)',
                                            borderWidth: "1px",
                                            borderColor: '#FF4993',
                                        }}
                                        size="sm" w={10} value={day} onClick={handleSelection}
                                    >
                                        {day}
                                    </Button>
                                </GridItem>
                            )
                        })}
                        {range(getNumberOfDaysInMonth(currentYear, currentMonth), 34).map((day) => (
                            <GridItem>
                                <Spacer />
                            </GridItem>
                        ))}
                        <GridItem>
                            <Button bg="#FF4993" color="whiteAlpha.800" size="sm" w={10} onClick={onToggleConverter} isActive={isOpenConverter} _active={{
                                bg: 'pink.800',
                                transform: 'scale(1.15)',
                                borderWidth: "1px",
                                borderColor: '#FF4993',
                            }}>
                                <TimeIcon />
                            </Button>
                        </GridItem>
                    </Grid>
                </Box>
                <Box>
                    <Collapse in={isOpenConverter} animateOpacity>
                        <Divider bg="#FF4993" />
                        <Stack direction="row" justify="space-between" align="center" color="#FF4993" pr={6} mt={2.5}>
                            <Stack direction="row" justify="center" align="center" spacing={0.5}>
                                <Input bg="whiteAlpha.800" size="sm" color="#525252" my={2} _placeholder={{ color: "#525252" }} placeholder="Convert Epochs" value={converterInputVal} onChange={handleConverterTime} />
                                <Stack px={1} spacing={1}>
                                    <Button size="xs" h={3.5} px={1} pb={0.5} borderRadius={100} onClick={setEpoch}><CheckIcon /></Button>
                                    <Button size="xs" h={3.5} px={1} pb={0.5} borderRadius={100} onClick={handleConverterReset}><NotAllowedIcon /></Button>
                                </Stack>
                            </Stack>
                            <Stack direction="column" justify="center" align="center" spacing={0}>
                                <Text fontSize={14}>{new Date(converterTime).toLocaleDateString() != "Invalid Date" ? new Date(converterTime).toLocaleDateString() : "Date out of range"}</Text>
                                <Text fontSize={14}>{new Date(converterTime).toLocaleTimeString() != "Invalid Date" ? new Date(converterTime).toLocaleTimeString() : null}</Text>
                            </Stack>
                        </Stack>
                    </Collapse>
                </Box>
            </Box>
        </Box >
    )
}

export default DatePicker