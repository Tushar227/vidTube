import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // If it’s not already an ApiError, wrap it
  let error = err;
  if (!(error instanceof ApiError)) {
    const isMongooseErr = error instanceof mongoose.Error;
    const statusCode = error.statusCode || (isMongooseErr ? 400 : 500);
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Build the response payload
  const payload = {
    statusCode: error.statusCode,
    success: error.success,
    data: error.data,
    message: error.message,
    errors: error.errors,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(payload);
};

export { errorHandler };
