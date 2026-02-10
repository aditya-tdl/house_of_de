import { prisma } from "../../config/db.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiResponse from "../../utils/ApiResponse.js";

/**
 * @desc Create new slots (Admin only)
 * @route POST /api/v1/slots
 */
export const createSlot = catchAsync(async (req, res) => {
    const { date, times, capacity } = req.body;

    if (!times || !Array.isArray(times) || times.length === 0) {
        return res.status(400).json(new ApiResponse(400, null, "At least one time slot is required"));
    }

    // Normalize date to YYYY-MM-DD at 00:00:00 UTC
    const dateObj = new Date(date);
    const formattedDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));

    // Check for existing slots on this date to prevent duplicates
    const existingSlots = await prisma.slot.findMany({
        where: {
            date: formattedDate,
            time: { in: times }
        },
        select: { time: true }
    });

    if (existingSlots.length > 0) {
        const existingTimes = existingSlots.map(s => s.time).join(", ");
        return res.status(400).json(new ApiResponse(400, null, `Slots already exist for: ${existingTimes}`));
    }

    // Create multiple slots
    const slotsData = times.map(time => ({
        date: formattedDate,
        time,
        capacity: parseInt(capacity) || 1,
    }));

    const createdSlots = await prisma.slot.createMany({
        data: slotsData
    });

    return res.status(201).json(new ApiResponse(201, createdSlots, `${createdSlots.count} slots created successfully`));
});

/**
 * @desc Get all slots
 * @route GET /api/v1/slots
 */
export const getAllSlots = catchAsync(async (req, res) => {
    const { date, available } = req.query;

    const where = {};
    if (date) {
        const dateObj = new Date(date);
        where.date = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
    }

    const slots = await prisma.slot.findMany({
        where,
        orderBy: [
            { date: "asc" },
            { time: "asc" },
        ],
    });

    const now = new Date();

    const processedSlots = slots.map(slot => {
        // Parse slot time "HH:mm AM/PM"
        const [timeRange, period] = slot.time.split(" ");
        let [hours, minutes] = timeRange.split(":").map(Number);

        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const slotDateTime = new Date(slot.date);
        slotDateTime.setHours(hours, minutes, 0, 0);

        const isOutdated = slotDateTime < now;

        let status = "Available";
        if (isOutdated) {
            status = "Outdated";
        } else if (slot.isBooked || slot.bookedCount >= slot.capacity) {
            status = "Full";
        }

        return {
            ...slot,
            isOutdated,
            status
        };
    });

    // Filter by availability and non-outdated if requested (for client side)
    let filteredSlots = processedSlots;
    if (available === "true") {
        filteredSlots = processedSlots.filter(slot => !slot.isOutdated && slot.status === "Available");
    }

    return res.status(200).json(new ApiResponse(200, filteredSlots, "Slots fetched successfully"));
});

/**
 * @desc Get slot by ID
 * @route GET /api/v1/slots/:id
 */
export const getSlotById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const slot = await prisma.slot.findUnique({
        where: { id: parseInt(id) },
        include: {
            bookings: true,
        },
    });

    if (!slot) {
        return res.status(404).json(new ApiResponse(404, null, "Slot not found"));
    }

    return res.status(200).json(new ApiResponse(200, slot, "Slot fetched successfully"));
});

/**
 * @desc Delete a slot (Admin only)
 * @route DELETE /api/v1/slots/:id
 */
export const deleteSlot = catchAsync(async (req, res) => {
    const { id } = req.params;

    await prisma.slot.delete({
        where: { id: parseInt(id) },
    });

    return res.status(200).json(new ApiResponse(200, null, "Slot deleted successfully"));
});
