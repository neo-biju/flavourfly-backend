import { NextFunction, Request, Response, RequestHandler } from "express";
import { ZodSchema } from "zod";

const validateRequest =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        path: error.path.join("."),
        message: error.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });

      return;
    }

    next();
  };

export default validateRequest;
