import dotenv from "dotenv";

// Load environment variables FIRST
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// console.log(`Loading environment from: ${envFile}`);

// Load immediately before anything else
dotenv.config({ path: envFile });

// Now import other modules
import app from "./app.js";
import { prisma } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
