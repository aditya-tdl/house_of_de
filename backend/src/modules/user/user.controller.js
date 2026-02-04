import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { getPagination, getSearch } from "../../utils/query.js";

export const getAllUsers = catchAsync(async (req, res) => {
    const { skip, take, page, limit } = getPagination(req.query);

    const searchCondition = getSearch(req.query, [
        "name",
        "email",
        "mobile",
    ]);

    // Base condition: NON-ADMIN users only
    const where = {
        role: {
            not: "ADMIN",
        },
    };

    // Attach search only if present
    if (searchCondition) {
        where.OR = searchCondition.OR;
    }


    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                gender: true,
                mobile: true,
                created_at: true
            },
        }),
        prisma.user.count({ where }),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
            "Users fetched successfully"
        )
    );
});


/**
 * @desc Update user profile (mobile and password only)
 * @route PUT /api/users/profile
 */
export const updateProfile = catchAsync(async (req, res) => {
    const { mobile, password } = req.body;
    const userId = req.user.id;

    const data = {};

    if (mobile) {
        // Check if mobile is already taken by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                mobile,
                id: { not: userId }
            }
        });

        if (existingUser) {
            return res.status(400).json(new ApiResponse(400, null, "Mobile number already in use"));
        }
        data.mobile = mobile;
    }

    if (password) {
        data.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json(new ApiResponse(400, null, "No changes provided"));
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            role: true,
            created_at: true
        }
    });

    return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
