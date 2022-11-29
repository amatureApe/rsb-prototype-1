const sleep = async (sleepTime) => {
    return new Promise((resolve) => setTimeout(resolve, sleepTime))
}

export default sleep