function handleDBError(errorType) {

    switch (errorType) {

        case 'queryExecutionError': {
            return {
                data: {
                    status: 'failed',
                    errorCode: 'CH501',
                    errorMessage: 'Internal Error Occured'
                }
            }
        }
        case 'connectionError': {
            return {
                data: {
                    status: 'failed',
                    errorCode: 'CH502',
                    errorMessage: 'Internal Error Occured'
                }
            }
        }
        case 'transactionError': {
            return {
                data: {
                    status: 'failed',
                    errorCode: 'CH503',
                    errorMessage: 'Internal Error Occured'
                }
            }
        }
        case 'not_approved': {
            return {
                data: {
                    status: 'failed',
                    errorCode: 'CH504',
                    errorMessage: 'Your account is not approved yet.'
                }
            }
        }
        case 'account_deleted': {
            return {
                data: {
                    status: 'failed',
                    errorCode: 'CH505',
                    errorMessage: 'User does not exist.'
                }
            }
        }
       
    }
}

module.exports = {
    handleDBError
}