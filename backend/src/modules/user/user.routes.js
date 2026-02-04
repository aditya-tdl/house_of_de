import express from "express";
import { getAllUsers, updateProfile } from "./user.controller.js";
import { admin, protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  admin,
  getAllUsers
);
router.put(
  "/profile",
  protect,
  updateProfile
);




export default router;
