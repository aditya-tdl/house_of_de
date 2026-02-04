import express from "express";
import {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    getBookingsByUserId,
} from "./booking.controller.js";

const router = express.Router();

router.route("/")
    .post(createBooking)
    .get(getAllBookings);

router.route("/:id")
    .get(getBookingById);

router.route("/user/:userId")
    .get(getBookingsByUserId);

router.route("/:id/status")
    .patch(updateBookingStatus);

export default router;
