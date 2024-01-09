import ApiError, { StatusCodes } from '../errors/ApiError.js';
import User from '../models/User.js';
import ResetPasswordToken from '../models/ResetPasswordToken.js';
export const findUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user)
    throw new ApiError('Invalid User Request', StatusCodes.BAD_REQUEST);
  return user;
};

export const findUserByEmail = async (userEmail) => {
  const user = await User.findOne({ email: userEmail });
  if (!user)
    throw new ApiError(
      'User Does Not Exist In Our Database',
      StatusCodes.BAD_REQUEST
    );
  return user;
};

export const findUserResetPasswordToken = async (email, token) => {
  const getToken = await ResetPasswordToken.findOne({
    $and: [{ email: email }, { token: token }],
  });
  if (!getToken) {
    throw new ApiError('Invalid Token Or Expired', StatusCodes.BAD_REQUEST);
  }
  return getToken;
};

export const updateUserData = (data, user_id) => {};
