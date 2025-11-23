import type { PaginationMeta } from '../../../domain/shared/pagination.js';

export type SuccessResponse<T> = {
    message: string;
    data: T;
};

export type PaginatedResponse<T> = {
    message: string;
    data: T[];
    pagination: PaginationMeta;
};

export type MessageResponse = {
    message: string;
};

export const buildSuccessResponse = <T>(message: string, data: T): SuccessResponse<T> => ({
    message,
    data,
});

export const buildPaginatedResponse = <T>(
    message: string,
    data: T[],
    pagination: PaginationMeta
): PaginatedResponse<T> => ({
    message,
    data,
    pagination,
});

export const buildMessageResponse = (message: string): MessageResponse => ({
    message,
});
