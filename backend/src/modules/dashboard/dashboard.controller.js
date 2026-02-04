import { prisma } from "../../config/db.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiResponse from "../../utils/ApiResponse.js";

/**
 * @desc Get dashboard statistics
 * @route GET /api/dashboard/stats
 */
export const getDashboardStats = catchAsync(async (req, res) => {
    const now = new Date();

    // Start of today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start of 7 days ago
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
        todayBookings,
        newUsers,
        activeSlots,
        totalRevenue
    ] = await Promise.all([
        // 1. Today's Bookings
        prisma.booking.count({
            where: {
                createdAt: {
                    gte: startOfToday
                },
                status: {
                    not: "CANCELLED"
                }
            }
        }),

        // 2. New Users (last 7 days)
        prisma.user.count({
            where: {
                created_at: {
                    gte: lastWeek
                },
                role: "USER"
            }
        }),

        // 3. Active Slots (Upcoming available slots)
        prisma.slot.count({
            where: {
                date: {
                    gte: startOfToday
                },
                isBooked: false
            }
        }),

        // 4. Total Revenue (Sum of price from confirmed bookings)
        prisma.booking.aggregate({
            _sum: {
                price: true
            },
            where: {
                status: "CONFIRMED"
            }
        })
    ]);

    // Format revenue for display (e.g., 4.2L for 420000)
    const revenueValue = totalRevenue._sum.price || 0;
    let formattedRevenue = `₹${revenueValue.toLocaleString()}`;
    if (revenueValue >= 100000) {
        formattedRevenue = `₹${(revenueValue / 100000).toFixed(1)}L`;
    } else if (revenueValue >= 1000) {
        formattedRevenue = `₹${(revenueValue / 1000).toFixed(1)}K`;
    }

    const stats = [
        {
            label: "Today's Bookings",
            value: todayBookings.toString(),
            icon: "CalendarCheck",
            change: "Real-time"
        },
        {
            label: "New Users",
            value: newUsers.toString(),
            icon: "UserPlus",
            change: "Last 7 days"
        },
        {
            label: "Active Slots",
            value: activeSlots.toString(),
            icon: "Clock",
            change: "Upcoming"
        },
        {
            label: "Total Revenue",
            value: formattedRevenue,
            icon: "TrendingUp",
            change: "Confirmed"
        },
    ];

    return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});
