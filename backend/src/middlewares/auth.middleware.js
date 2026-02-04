import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        // Get token from cookie or header

        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            console.log("Auth Header Missing or Incorrect:", req.headers.authorization); // Debug log
            throw new ApiError(401, "Not authorized, no token provided");
        }

        token = req.headers.authorization.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role: true }, // Exclude password, include role
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, "Not authorized, token failed"));
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        next(new ApiError(403, "Not authorized as an admin"));
    }
};
