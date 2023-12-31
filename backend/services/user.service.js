import User from '../models/User.js';
import httpError from 'http-errors';
export const findUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw httpError.BadRequest('Invalid User');
  return user;
};
