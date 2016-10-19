class ApiError extends Error {

    constructor(code, message) {
        super(message);
        this.code = code || 500;
        this.message = message || "UnknownError";
    }

    static Middleware () {
        return (error, req, res, next) => {
            console.error("Request error", error);

            const result = {
                success: false,
                message: "Request error"
            };
            if (error instanceof ApiError) {
                result.message = error.message;
                res.status(error.code);
                res.send(result);
            } else {
                res.status(500);
                res.send(result);
            }
        };
    };
}

ApiError.Unknown = new ApiError(500, "Unknown error");
ApiError.Unavailable = new ApiError(503, "Unavailable");
ApiError.Unauthorized = new ApiError(401, "Unauthorized");
ApiError.BadCredentials = new ApiError(401, "Bad credentials");
ApiError.JwtError = new ApiError(500, "Token error");


module.exports = ApiError;