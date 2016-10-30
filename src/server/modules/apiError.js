class ApiError extends Error {

    constructor(code, message, details) {
        super(message);
        this.code = code || 500;
        this.message = message || "UnknownError";
        this.details = details || null;
    }

    static Middleware () {
        return (error, req, res, next) => {
            req.logger.error(error);

            const result = {
                success: false,
                message: "Unknown error"
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

ApiError.Unknown = (err) => new ApiError(500, "Unknown error", err);
ApiError.Unavailable = (err) => new ApiError(503, "Unavailable", err);
ApiError.Unauthorized = () => new ApiError(401, "Unauthorized");
ApiError.BadCredentials = () => new ApiError(401, "Bad credentials");
ApiError.TokenExpired = () => new ApiError(401, "Token expired");
ApiError.InvalidToken = (err) => new ApiError(400, "Invalid token", err);
ApiError.InvalidParams = (params) => new ApiError(400, "Invalid parameters", params);

module.exports = ApiError;