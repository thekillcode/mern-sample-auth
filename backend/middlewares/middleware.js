import routeNotFoundMiddleware from './routeNotFoundMiddleware.js';
import defaultErrorHandler from './defaultErrorHandler.js';

/* The line `export { routeNotFoundMiddleware, defaultErrorHandler };` is exporting the
`routeNotFoundMiddleware` and `defaultErrorHandler` variables from the current module. This allows
other modules to import and use these variables. */
export { routeNotFoundMiddleware, defaultErrorHandler };
