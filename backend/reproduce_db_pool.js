import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/index.js";
import pg from "pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Connecting...");
        // Try to find a user that likely doesn't exist, just like the register check
        const email = "nonexistent@example.com";
        console.log(`Checking for user with email: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log("Query successful. User found:", user);
    } catch (error) {
        console.error("Connection failed:", JSON.stringify(error, null, 2));
        console.error("Error cause:", error.cause);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
