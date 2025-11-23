import type { ParsedQs } from 'qs';

const DEFAULT_QUERY_SIGNATURE = 'default';

const normalizeValue = (value: unknown): string => {
    if (value === undefined || value === null) {
        return '';
    }

    if (Array.isArray(value)) {
        return value.map((item) => normalizeValue(item)).join(',');
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
};

const buildQuerySignature = (query?: ParsedQs | Record<string, unknown>): string => {
    if (!query) {
        return DEFAULT_QUERY_SIGNATURE;
    }

    const normalized = Object.entries(query)
        .filter(([, value]) => value !== undefined && value !== null && normalizeValue(value as string | string[]) !== '')
        .map(([key, value]) => ({ key, value: normalizeValue(value as string | string[]) }))
        .sort((a, b) => a.key.localeCompare(b.key));

    if (!normalized.length) {
        return DEFAULT_QUERY_SIGNATURE;
    }

    return normalized.map(({ key, value }) => `${key}:${value}`).join('|');
};

export const buildListCacheKey = (prefix: string, query?: ParsedQs | Record<string, unknown>): string => {
    const signature = buildQuerySignature(query);
    return `${prefix}:${signature}`;
};

export const buildDetailCacheKey = (prefix: string, identifier: string | number): string => `${prefix}:${identifier}`;
