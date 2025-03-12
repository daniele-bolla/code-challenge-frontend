import { sendResponse } from '../utils/response';

import { Request, Response, NextFunction} from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof Error) {
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      message = 'Not Found';
    }
  }

  sendResponse(res, statusCode, null, message);
};