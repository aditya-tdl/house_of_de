import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { getPagination, getSearch } from "../../utils/query.js";

/**
 * @desc Create a new booking
 * @route POST /api/v1/bookings
 */
export const createBooking = catchAsync(async (req, res) => {
    const {
        slotId,
        fullName,
        email,
        phone,
        shirtType,
        price,
        specialRequests,
        appointmentType,
    } = req.body;

    const booking = await prisma.$transaction(async (tx) => {
        // 1. Find or Create User
        let user = await tx.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { mobile: phone }
                ]
            }
        });

        if (!user) {
            // Hash a default password for the new user
            const hashedPassword = await bcrypt.hash("Booking@123", 10);

            user = await tx.user.create({
                data: {
                    name: fullName,
                    email: email,
                    mobile: phone,
                    password: hashedPassword,
                    gender: "OTHER", // Default value
                    role: "USER"
                }
            });
        }

        // 2. Create the booking
        const newBooking = await tx.booking.create({
            data: {
                userId: user.id,
                slotId: slotId ? parseInt(slotId) : null,
                fullName,
                email,
                phone,
                shirtType,
                price: parseFloat(price),
                specialRequests,
                appointmentType,
                status: "CONFIRMED", // Instant Booking (Use Case 3)
            },
        });

        // 3. If slotId is provided, track capacity (Use Case 2 & 4)
        if (slotId) {
            const slot = await tx.slot.findUnique({
                where: { id: parseInt(slotId) },
            });

            if (!slot || slot.isBooked || slot.bookedCount >= slot.capacity) {
                throw new Error("Slot is fully booked or not found");
            }

            const updatedSlot = await tx.slot.update({
                where: { id: parseInt(slotId) },
                data: {
                    bookedCount: { increment: 1 },
                },
            });

            // If capacity reached, mark as booked
            if (updatedSlot.bookedCount >= updatedSlot.capacity) {
                await tx.slot.update({
                    where: { id: parseInt(slotId) },
                    data: { isBooked: true },
                });
            }
        }

        return newBooking;
    });

    return res.status(201).json(new ApiResponse(201, booking, "Booking created successfully"));
});

/**
 * @desc Get all bookings with pagination and search
 * @route GET /api/v1/bookings
 */
export const getAllBookings = catchAsync(async (req, res) => {
    const { skip, take, page, limit } = getPagination(req.query);
    const searchCondition = getSearch(req.query, ["fullName", "email", "phone", "shirtType"]);

    const where = searchCondition || {};

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            skip,
            take,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                slot: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.booking.count({ where }),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookings,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
            "Bookings fetched successfully"
        )
    );
});

/**
 * @desc Get single booking by ID
 * @route GET /api/v1/bookings/:id
 */
export const getBookingById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
        where: { id: parseInt(id) },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            slot: true,
        },
    });

    if (!booking) {
        return res.status(404).json(new ApiResponse(404, null, "Booking not found"));
    }

    return res.status(200).json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

/**
 * @desc Update booking status
 * @route PATCH /api/v1/bookings/:id/status
 */
export const updateBookingStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await prisma.$transaction(async (tx) => {
        const oldBooking = await tx.booking.findUnique({
            where: { id: parseInt(id) },
        });

        if (!oldBooking) {
            throw new Error("Booking not found");
        }

        const updatedBooking = await tx.booking.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        // Use Case 5: If booking is cancelled, decrease bookedCount
        if (status === "CANCELLED" && oldBooking.status !== "CANCELLED" && oldBooking.slotId) {
            await tx.slot.update({
                where: { id: oldBooking.slotId },
                data: {
                    bookedCount: { decrement: 1 },
                    isBooked: false, // Ensure it's marked as available
                },
            });
        } else if (status === "CONFIRMED" && oldBooking.status === "CANCELLED" && oldBooking.slotId) {
            // If re-confirming, increase count
            const slot = await tx.slot.findUnique({ where: { id: oldBooking.slotId } });
            if (slot.bookedCount >= slot.capacity) {
                throw new Error("Cannot confirm booking, slot is full");
            }
            const updatedSlot = await tx.slot.update({
                where: { id: oldBooking.slotId },
                data: {
                    bookedCount: { increment: 1 },
                },
            });
            if (updatedSlot.bookedCount >= updatedSlot.capacity) {
                await tx.slot.update({
                    where: { id: updatedSlot.id },
                    data: { isBooked: true }
                });
            }
        }

        return updatedBooking;
    });

    return res.status(200).json(new ApiResponse(200, result, "Booking status updated successfully"));
});

/**
 * @desc Get bookings by User ID
 * @route GET /api/v1/bookings/user/:userId
 */
export const getBookingsByUserId = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const userWithBookings = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            bookings: {
                include: {
                    slot: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!userWithBookings) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res.status(200).json(new ApiResponse(200, userWithBookings, "User bookings fetched successfully"));
});
