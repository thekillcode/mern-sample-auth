import User from '../models/User.js';
import { findUser } from '../services/user.service.js';

export const profile = async (req, res, next) => {
  try {
    const user = await findUser(req.user.userId);
    res.json({
      user: user.publicResponse(),
    });
  } catch (error) {
    next(error);
  }
};
export const profileUpdate = async (req, res, next) => {
  try {
    const { firstname, lastname } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      { firstname: firstname, lastname: lastname },
      { new: true }
    );

    return res.json({
      message: 'User Updated Successfully',
      user: updatedUser.publicResponse(),
    });
  } catch (error) {
    next(error);
  }
};
