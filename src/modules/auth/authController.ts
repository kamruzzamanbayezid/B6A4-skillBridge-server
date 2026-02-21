import { NextFunction, Request, Response } from "express";
import { authService } from "./authServices";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.createUser(req?.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const logInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req?.body);

    res.cookie("token", result?.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged in successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const authController = {
  createUser,
  logInUser,
};
