class ApiError extends Error {

    constructor(code, message) {
        super(message);
        this.code = code || 500;
        this.message = message || "UnknownError";
    }

    static Middleware(error, req, res, next) {
        console.error("Request error", error);

        if(error instanceof ApiError) {
            res.status(error.code);
            res.send(error.message);
        } else {
            res.status(500);
            res.send("Request error");
        }
    };
}

ApiError.Unauthorized = new ApiError(403, "Unauthorized");


module.exports = ApiError;