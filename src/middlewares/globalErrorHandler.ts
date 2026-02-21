import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let errMessage = "Internal server Error!";

  let simpleError = "Something went wrong";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errMessage = "Incorrect body or missing a fields";
    simpleError = "You provided wrong data or missed some fields.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      errMessage = "Duplicate value: This record already exists!";
      simpleError = `The ${err.meta?.target} you entered is already in use.`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      errMessage = "Record not found!";
      simpleError = "We couldn't find what you were looking for.";
    }
  } else if (err instanceof Error) {
    statusCode = 401;
    errMessage = err.message;
    simpleError = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: errMessage,
    error: simpleError,
  });
};

export default globalErrorHandler;
