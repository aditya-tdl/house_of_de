import express from "express";
import {
    createSlot,
    getAllSlots,
    getSlotById,
    deleteSlot,
} from "./slot.controller.js";
import { admin, protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/")
    .post(protect, admin, createSlot)
    .get(getAllSlots);

router.route("/:id")
    .get(protect,
        admin, getSlotById)
    .delete(protect,
        admin, deleteSlot);

export default router;
