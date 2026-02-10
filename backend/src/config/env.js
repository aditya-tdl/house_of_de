import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST
const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";

console.log(`Loading environment from: ${envFile}`);

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
