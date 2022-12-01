import React, { forwardRef, useState } from "react"
import { Button, Box, Stack, Input, Menu, MenuButton, MenuList, MenuItem, Text, useColorModeValue } from "@chakra-ui/react";
import DatePicker from "react-datepicker"
import { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getYear, getMonth } from "date-fns"

import { ChevronDownIcon, CalendarIcon } from "@chakra-ui/icons";

const range = require("lodash.range")



const Expiry = ({ startDate, onChange }) => {
    const [displayDate, setDisplayDate] = useState(new Date())
    const [year, setYear] = useState(getYear(new Date()))
    const [month, setMonth] = useState(getMonth(new Date()))
    const years = range(2022, getYear(new Date()) + 100, 1);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    console.log(month)

    const DateContainer = ({ className, children }) => {
        return (
            <div style={{ padding: "16px", background: "rgba(255, 73, 147, 0.7)", color: "#fff" }}>
                <CalendarContainer className={className}>
                    <div style={{ position: "relative" }}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <Button bg="#FF4993" onClick={onClick} ref={ref} _hover={{ bg: 'pink.500' }}>
            <Stack direction="row">
                <Text>{value}</Text>
                <CalendarIcon />
            </Stack>
        </Button>
    ))

    return (
        <Box>
            <DatePicker
                startDate={displayDate}
                selected={startDate}
                onChange={(date) => onChange(date)}
                calendarContainer={DateContainer}
                customInput={<CustomInput />}
                minDate={new Date()}
                showDisabledMonthNavigation
                shouldCloseOnSelect={false}
                fixedHeight
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <Box
                        style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center",
                        }}
                        color="#FF4993"

                    >
                        <Button size="sm" color="#FF4993" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            {"<"}
                        </Button>

                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} onChange={({ target: { value } }) => changeYear(value)}>
                                {year}
                            </MenuButton>
                            <MenuList overflowY="scroll" h={300}>
                                {years.map((option) => (
                                    <MenuItem key={option} value={option} onClick={({ target: { value } }) => setYear(value)}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>

                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }>
                                {months[month]}
                            </MenuButton>
                            <MenuList overflowY="scroll" h={300}>
                                {months.map((option) => (
                                    <MenuItem key={option} value={option} onClick={({ target: { value } }) => setMonth(months.indexOf(value))}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>

                        <Button size="sm" color="#FF4993" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            {">"}
                        </Button>
                    </Box>
                )}
            />
        </Box >
    );
};

export default Expiry