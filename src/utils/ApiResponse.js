class ApiResponse {
    constructor(statuseCode, data, message = "success") {
        this.statuseCode = statuseCode;
        this.data = data;
        this.message = message;
        this.success = statuseCode < 400;

    }
}

export { ApiResponse }