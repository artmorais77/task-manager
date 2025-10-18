import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

function errorHandling(
  error: any,
  req: Request,
  res: Response,
  _: NextFunction
) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
  }
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "validation error",
      issues: error.format(),
    });
  }

  return res.status(500).json({ message: error.error });
}

export { errorHandling };
