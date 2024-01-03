import jwt from 'jsonwebtoken';
import logger from './logger.js';
/**
 * The function `sign` is an asynchronous function that generates a JSON Web Token (JWT) using the
 * provided payload, expiration time, and secret key.
 * @param payload - The payload is an object that contains the data you want to include in the token.
 * It can be any valid JSON object that you want to encode and include in the token.
 * @param expiresIn - The expiresIn parameter specifies the duration of time after which the token will
 * expire. It can be specified in various formats such as seconds (e.g., "60"), minutes (e.g., "10m"),
 * hours (e.g., "2h"), days (e.g., "7d"), etc
 * @param secret - The `secret` parameter is a string that is used to sign the JWT (JSON Web Token). It
 * is a secret key that should be kept confidential and known only to the server that generates the
 * token. The secret key is used to verify the authenticity of the token when it is received by the
 * server
 * @returns The `sign` function returns a Promise that resolves to a JWT token if the signing process
 * is successful.
 */
export const sign = async (payload, expiresIn, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: expiresIn }, (error, token) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
};
/**
 * The function `verify` takes a token and a secret, and uses the `jwt.verify` method to verify the
 * token and return the payload if successful, or null if there is an error.
 * @param token - The `token` parameter is a string representing the JSON Web Token (JWT) that needs to
 * be verified. This token contains encoded information about the user or client making the request.
 * @param secret - The `secret` parameter is a string that represents the secret key used to sign the
 * token. This secret key is known only to the server and is used to verify the authenticity of the
 * token.
 * @returns The `verify` function returns a promise that resolves to either `null` if there is an error
 * verifying the token, or the `payload` if the token is successfully verified.
 */
export const verify = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) resolve(null);
      else resolve(payload);
    });
  });
};
