function handleDBError(errorType) {

    switch (errorType) {

        case 'queryExecutionError': {
            return {
                data: {
                    errorCode: 'CH501',
                    errorMessage: 'Internal Error Occured'
                }
            }
        }
        case 'connectionError': {
            return {
                data: {
                    errorCode: 'CH502',
                    errorMessage: 'Internal Error Occured'
                }
            }
        }


    }
}

module.exports = {
    handleDBError
}