import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, data: unknown, message?: string) => {
    res.status(statusCode).json({
      status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
      message: message || (statusCode >= 200 && statusCode < 300 ? 'Operation successful' : 'Operation failed'),
      data: data || null,
    });
  };