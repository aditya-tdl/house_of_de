import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import morgan from "morgan";

const app = express();

const allowedOrigins = [
  "https://house-of-de-red.vercel.app",
  "http://localhost:8080",
  "https://jncvd963-8080.inc1.devtunnels.ms",
  "https://3rx6504d-8080.inc1.devtunnels.ms",
  "https://jncvd963-8080.inc1.devtunnels.ms",
];
// CORS configuration for cross-origin requests and credentials
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(morgan("dev"));

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
