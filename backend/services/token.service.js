import { sign, verify } from '../utils/token.utils.js';
export const generateToken = async (payload, expiresIn, secret) => {
  return await sign(payload, expiresIn, secret);
};
export const verifyToken = async (token, secret) => {
  return await verify(token, secret);
};
