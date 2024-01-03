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
