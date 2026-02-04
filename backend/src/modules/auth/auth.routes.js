import express from "express";
import { login, register, registerAdmin } from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

// Test protected route
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
});

export default router;
