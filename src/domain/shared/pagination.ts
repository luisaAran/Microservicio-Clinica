export type PaginationParams = {
    page: number;
    limit: number;
};

export type PaginatedResult<T> = {
    data: T[];
    page: number;
    limit: number;
    total: number;
};

export type ListResponse<T> = {
    data: T[];
    pagination: PaginationMeta;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export const buildPaginationMeta = ({ page, limit, total }: PaginationParams & { total: number }): PaginationMeta => ({
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit) || 1),
});

export const createPaginatedResult = <T>(
    data: T[],
    params: PaginationParams,
    total: number
): PaginatedResult<T> => ({
    data,
    total,
    page: params.page,
    limit: params.limit,
});
