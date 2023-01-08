export const PendingStyle = {
    title: 'Pending',
    description: 'Transaction is being confirmed',
    status: 'loading',
    containerStyle: {
        width: '800px',
        maxWidth: '75%',
        border: '2px solid blue',
        borderRadius: '10px',
        padding: '2px'
    },
    variant: 'solid',
    position: 'top-left',
    duration: 20000,
    isClosable: true
}

export const SuccessStyle = {
    title: 'Success!',
    description: 'Transaction has been confirmed',
    status: 'success',
    containerStyle: {
        width: '800px',
        maxWidth: '75%',
        border: '2px solid green',
        borderRadius: '10px',
        padding: '2px'
    },
    variant: 'solid',
    position: 'top-left',
    duration: 20000,
    isClosable: true
}




export const ErrorStyle = (error) => {
    return {
        title: 'Error!',
        description: error.message.toString(),
        status: 'error',
        containerStyle: {
            width: '800px',
            maxWidth: '75%',
            border: '2px solid red',
            borderRadius: '10px',
            padding: '2px'
        },
        variant: 'solid',
        position: 'top-left',
        duration: 20000,
        isClosable: true
    }
}