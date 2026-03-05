import { NextFunction, Request, Response } from "express";
import { categoryService } from "./categoryServices";
import sendResponse from "../../utils/sendResponse";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.createCategory(req?.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getALlCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.getALlCategories();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category retrieve successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req?.params?.categoryId;
  const name = req?.body?.name;

  try {
    const result = await categoryService.updateCategory(id, name);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const categoryId = req?.params?.categoryId;

  try {
    await categoryService.deleteCategory(categoryId as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category deleted successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const categoryController = {
  createCategory,
  getALlCategories,
  updateCategory,
  deleteCategory,
};
