const ErrorMiddleware = (error, req, res, next) => {
    console.error("Request error");
    console.error(error);
    res.send("Request error");
};

module.exports = ErrorMiddleware;