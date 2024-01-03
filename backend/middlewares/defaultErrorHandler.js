/**
 * This  function is a default error handler for a JavaScript application that sets the response
 * status and returns a JSON object with the error status and message.
 * @param err - The `err` parameter is the error object that is passed to the error handler middleware.
 * It contains information about the error that occurred, such as the error message, status code, and
 * any additional properties that were set when the error was thrown.
 * @param req - The `req` parameter represents the HTTP request object. It contains information about
 * the incoming request, such as the request headers, request method, request URL, and request body.
 * @param res - The `res` parameter is the response object that represents the HTTP response that will
 * be sent back to the client. It is used to set the status code and send the JSON response.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when an error occurs and you want to
 * pass the error to the next error-handling middleware function.
 * @returns a JSON object with an "error" property. The "error" property contains a "status" property,
 * which is set to the value of err.status or 500 if err.status is falsy. The "error" property also
 * contains a "message" property, which is set to the parsed JSON value of err.message.
 */
const defaultErrorHandler = async (err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    error: {
      status: err.status || 500,
      message: JSON.parse(err.message),
    },
  });
};
export default defaultErrorHandler;
