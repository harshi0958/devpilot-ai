import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors?.reduce((acc: Record<string, string[]>, curr: any) => {
          const field = curr.path.join('.');
          if (!acc[field]) acc[field] = [];
          acc[field].push(curr.message);
          return acc;
        }, {}) || error.message,
      });
    }
  };
};