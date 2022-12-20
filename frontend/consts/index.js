export const monthNames = [
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

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const WEEK_IN_SECONDS = 604800

export const BET_STATUS = {
    0: { status: 'LOADING', color: 'yellow' },
    1: { status: 'OPEN', color: 'green' },
    2: { status: 'ACTIVE', color: 'blue' },
    3: { status: 'SETTLING', color: 'purple' },
    4: { status: 'SETTLED', color: 'orange' },
    5: { status: 'CLAIMED', color: 'gray' },
    6: { status: 'DEAD', color: 'whiteAlpha' }
}