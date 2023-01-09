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

export const AVAILABLE_NETWORKS = ['0x5']

export const COLLATERAL_ADDRESSES = {
    '0x5': {
        'weth': '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        'wbtc': '0xc04b0d3107736c32e19f1c62b2af67be61d63a05',
        'dai': '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
        'usdc': '0x3a034fe373b6304f98b7a24a3f21c958946d4075',
        'uma': 'UMA'
    }
}