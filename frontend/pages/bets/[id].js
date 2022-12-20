import contractConnection from "../../utils/contractConnection"
import handler from '../../../smart-contracts/deployments/goerli/OO_BetHandler.json'
import { useEffect, useState } from "react"
import { ethers, utils, BigNumber } from 'ethers'
import getBet from "../../utils/getBet"

const Details = ({ accounts, id }) => {
    const [bet, setBet] = useState([])
    let contract

    const getContract = async () => {
        contract = await contractConnection(handler.address, handler.abi)
    }

    const handleBet = async () => {
        const response = await getBet(id)
        setBet(response)
    }

    useEffect(() => {
        handleBet()
    }, [])

    console.log(bet)

    return (
        <div>
            <h1>{accounts[0]}</h1>
            <h1>{id}</h1>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params

    return {
        props: {
            id
        }
    }

}

export default Details