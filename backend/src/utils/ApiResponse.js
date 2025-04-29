//standarized response format for all api responses
//this will help us to handle all responses in a consistent manner
class ApiResponse {
    constructor(statusCode,data, message="Success" ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {ApiResponse}