import ApiError, { StatusCodes } from '../errors/ApiError.js';

/**
 * The `routeNotFoundMiddleware` function is a middleware that handles requests for routes that do not
 * exist by throwing an `ApiError` with a status code of `NOT_FOUND`.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request method, request URL, request body, etc. It is an
 * object that is automatically created by the Express framework and passed to middleware functions.
 * @param res - The `res` parameter is the response object in Express.js. It represents the HTTP
 * response that will be sent back to the client. It is used to send data, set headers, and end the
 * response.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically called as `next()` to invoke the next
 * middleware function. In this case, it is used to pass control to the error handling middleware with
 * an instance of `
 */
const routeNotFoundMiddleware = (req, res, next) => {
  next(new ApiError('This Route Does Not Exist', StatusCodes.NOT_FOUND));
};
export default routeNotFoundMiddleware;
