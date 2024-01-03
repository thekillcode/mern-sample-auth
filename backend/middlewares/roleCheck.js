const roleCheck = (roles) => async (req, res, next) => {
  next();
};

export default roleCheck;
