import httpError from 'http-errors';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import jwt from 'jsonwebtoken';
const auth = async (req, res, next) => {
  if (!req.headers.authorization)
    return next(httpError.Unauthorized(ReasonPhrases.UNAUTHORIZED));
  const bearerToken = req.headers.authorization;
  const completeToken = bearerToken.split(' ');
  const tokenKey = completeToken[0];
  const tokenValue = completeToken[1];
  if (tokenKey.toLowerCase() !== 'lord' || !tokenValue)
    return next(httpError.Unauthorized('Invalid Token'));
  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, payload) => {
    if (err) return next(httpError.Unauthorized());
    req.user = payload;
    next();
  });
};
export default auth;
