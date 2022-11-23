import { ethers } from 'ethers'

const contractConnection = async (address, abi) => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            address,
            abi.abi,
            signer
        )
        return contract
    } else {
        return
    }
}

export default contractConnection