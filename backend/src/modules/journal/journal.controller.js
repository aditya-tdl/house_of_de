import { prisma } from "../../config/db.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { getPagination } from "../../utils/query.js";

/**
 * @desc Generate a URL-friendly slug from a title
 */
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-0\s-]/g, "") // Remove non-alphanumeric except spaces and hyphens
        .replace(/\s+/g, "-")        // Replace spaces with hyphens
        .replace(/-+/g, "-")         // Replace multiple hyphens with single hyphen
        .trim();
};

/**
 * @desc Create a new journal entry (Admin only)
 * @route POST /api/v1/journal
 */
export const createPost = catchAsync(async (req, res) => {
    const { title, category, readTime, excerpt, content, image, status } = req.body;

    const slug = generateSlug(title);

    // Check for duplicate slug
    const existingPost = await prisma.blog.findUnique({ where: { slug } });
    if (existingPost) {
        return res.status(400).json(new ApiResponse(400, null, "A post with this title/slug already exists"));
    }

    const blog = await prisma.blog.create({
        data: {
            title,
            slug,
            category: category.toUpperCase(),
            readTime,
            excerpt,
            content,
            image,
            status: status || "DRAFT",
            publishedAt: status === "PUBLISHED" ? new Date() : null,
        },
    });

    return res.status(201).json(new ApiResponse(201, blog, "Journal entry created successfully"));
});

/**
 * @desc Update a journal entry (Admin only)
 * @route PATCH /api/v1/journal/:id
 */
export const updatePost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, category, readTime, excerpt, content, image, status } = req.body;

    const existingPost = await prisma.blog.findUnique({ where: { id: parseInt(id) } });
    if (!existingPost) {
        return res.status(404).json(new ApiResponse(404, null, "Journal entry not found"));
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category.toUpperCase();
    if (readTime !== undefined) updateData.readTime = readTime;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;

    if (title && title !== existingPost.title) {
        updateData.slug = generateSlug(title);
    }

    if (status === "PUBLISHED" && existingPost.status !== "PUBLISHED") {
        updateData.publishedAt = new Date();
    }

    const blog = await prisma.blog.update({
        where: { id: parseInt(id) },
        data: updateData,
    });

    return res.status(200).json(new ApiResponse(200, blog, "Journal entry updated successfully"));
});

/**
 * @desc Delete a journal entry (Admin only)
 * @route DELETE /api/v1/journal/:id
 */
export const deletePost = catchAsync(async (req, res) => {
    const { id } = req.params;

    const existingPost = await prisma.blog.findUnique({ where: { id: parseInt(id) } });
    if (!existingPost) {
        return res.status(404).json(new ApiResponse(404, null, "Journal entry not found"));
    }

    await prisma.blog.delete({ where: { id: parseInt(id) } });

    return res.status(200).json(new ApiResponse(200, null, "Journal entry deleted successfully"));
});

/**
 * @desc Get all journal entries (Public or Admin)
 * @route GET /api/v1/journal
 */
export const getAllPosts = catchAsync(async (req, res) => {
    const { skip, take, page, limit } = getPagination(req.query);
    const { status, category } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category.toUpperCase();

    // For public requests, normally we'd only show PUBLISHED
    // But since this API will be used by Admin as well, we'll keep it flexible
    // or handle public/private in the route/middleware later.

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
        }),
        prisma.blog.count({ where }),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                blogs,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
            "Journal entries fetched successfully"
        )
    );
});

/**
 * @desc Get single journal entry by slug
 * @route GET /api/v1/journal/:slug
 */
export const getPostBySlug = catchAsync(async (req, res) => {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
        where: { slug },
    });

    if (!blog) {
        return res.status(404).json(new ApiResponse(404, null, "Journal entry not found"));
    }

    return res.status(200).json(new ApiResponse(200, blog, "Journal entry fetched successfully"));
});
