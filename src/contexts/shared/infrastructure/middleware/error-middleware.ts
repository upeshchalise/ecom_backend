/* eslint-disable @typescript-eslint/no-base-to-string */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { HTTP404Error, HTTPClientError } from '../../domain/errors/http.exception';
import { ILogger } from '../../domain/interface/ILogger';
import { MESSAGE_CODES } from '../utils/message-code';

export class ErrorMiddleware {
  constructor(private logger: ILogger) {}

  public routeNotFoundErrorHandler = (_req: Request, res: Response): void => {
    throw new HTTP404Error(MESSAGE_CODES.NOT_FOUND);
  };

  public clientErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof HTTPClientError) {
      this.logger.error(`${req.method.toUpperCase()}: ${req.path}  client errror ${err.message}`);
      res.status(err.statusCode).send({ message: err.message });
    } else {
      next(err);
    }
  };

  public InternalServerError = (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
    this.logger.error(err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: MESSAGE_CODES.INTERNAL_SERVER_ERROR });
  };
}
