import jwt from 'jsonwebtoken';
import ApiError, { ReasonPhrases, StatusCodes } from '../errors/ApiError.js';
/**
 * The `auth` function is a middleware that checks for a valid bearer token in the request headers and
 * verifies it using JWT, allowing authorized users to proceed to the next middleware or route handler.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, request URL, and
 * other relevant details.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send the
 * response back to the client.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to move to the next
 * middleware function or to handle errors.
 * @returns the result of calling the `next` function with an `ApiError` object as an argument.
 */
const auth = async (req, res, next) => {
  if (!req.headers.authorization)
    return next(
      new ApiError(ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
    );
  const bearerToken = req.headers.authorization;
  const completeToken = bearerToken.split(' ');
  const tokenKey = completeToken[0];
  const tokenValue = completeToken[1];
  if (tokenKey.toLowerCase() !== 'bearer' || !tokenValue)
    return next(new ApiError('Invalid Token', StatusCodes.UNAUTHORIZED));
  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, payload) => {
    if (err)
      return next(
        new ApiError(ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
      );
    req.user = payload;
    next();
  });
};
export default auth;
