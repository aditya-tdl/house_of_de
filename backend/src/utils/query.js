/**
 * Reusable utility for Prisma pagination and search
 */

export const getPagination = (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 100);

    return {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
    };
};

export const getSearch = (query, fields = []) => {
    const search = query.search?.trim();

    if (!search || fields.length === 0) {
        return null;
    }

    return {
        OR: fields.map((field) => ({
            [field]: {
                contains: search,
                mode: "insensitive",
            },
        })),
    };
};

export const getFilter = (query, fields = []) => {
    const filters = {};

    fields.forEach((field) => {
        if (query[field]) {
            filters[field] = {
                contains: query[field],
                mode: "insensitive",
            };
        }
    });

    return filters;
};
