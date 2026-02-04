import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR 💥", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  /* -------------------------------------------------- */
  /* ✅ PRISMA ERRORS HANDLING */
  /* -------------------------------------------------- */

  // Value too long for column
  if (err.code === "P2000") {
    statusCode = 400;
    message = "Input value is too long for one of the fields";
  }

  // Unique constraint failed
  if (err.code === "P2002") {
    statusCode = 400;
    const field = err.meta?.target?.join(", ");
    message = `Duplicate value for ${field}`;
  }

  // Foreign key constraint failed
  if (err.code === "P2003") {
    statusCode = 400;
    message = "Invalid reference to related resource";
  }

  // Raw DB constraint errors (CHECK constraints from PostgreSQL)
  if (err.message?.includes("violates check constraint")) {
    statusCode = 400;

    if (err.message.includes("webinars_capacity_positive")) {
      message = "Capacity must be greater than 0";
    } else if (err.message.includes("webinars_duration_positive")) {
      message = "Duration must be greater than 0";
    } else if (err.message.includes("webinars_price_if_paid")) {
      message =
        "Paid webinar must have a price, Free webinar cannot have a price";
    } else {
      message = "Invalid data provided";
    }
  }

  /* -------------------------------------------------- */
  /* ✅ IF ERROR ALREADY ApiError, KEEP IT */
  /* -------------------------------------------------- */
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  /* -------------------------------------------------- */
  /* ✅ FINAL RESPONSE */
  /* -------------------------------------------------- */
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
