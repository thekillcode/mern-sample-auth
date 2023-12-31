import httpErrors from 'http-errors';

export const routeNotFoundMiddleware = (req, res, next) => {
  next(httpErrors.NotFound('This Route Does Not Exist'));
};
