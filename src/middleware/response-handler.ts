import type { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      success: (message: string, data?: unknown, status?: number) => void;
      data: (data: unknown, metadata?: unknown) => void;
      error: (error: string | object, status?: number) => void;
      serverError: () => void;
      unauthorized: () => void;
      notFound: (what: string) => void;
    }
  }
}

export const responseEnhancer = (req: Request, res: Response, next: NextFunction): void => {
  res.success = (message: string, data: unknown = null, status: number = 200): void => {
    res.status(status).json({
      status,
      success: true,
      message,
      data,
    });
  };

  res.data = (data: unknown, metadata: unknown = {}): void => {
    res.status(200).json({
      status: 200,
      success: true,
      data,
      metadata,
    });
  };

  res.error = (error: string | object, status: number = 400): void => {
    res.status(status).json({
      status,
      success: false,
      error,
    });
  };

  res.serverError = (): void => {
    res.status(500).json({
      status: 500,
      success: false,
      error: 'Server failed to process your request',
    });
  };

  res.unauthorized = (): void => {
    res.status(401).json({
      status: 401,
      success: false,
      error: 'Unauthorized',
    });
  };

  res.notFound = (what: string): void => {
    res.status(404).json({
      status: 404,
      success: false,
      error: `${what} Not Found`,
    });
  };

  next();
};