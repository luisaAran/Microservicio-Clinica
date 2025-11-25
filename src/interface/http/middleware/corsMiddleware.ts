import type { Request } from 'express';
import cors, { type CorsRequest } from 'cors';

const parseOrigins = (value: string | undefined, fallback: string[]): Set<string> => {
    if (!value) {
        return new Set(fallback);
    }
    return new Set(
        value
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean)
    );
};

const defaultPort = process.env.PORT || '8001';
const FULL_ACCESS_ORIGINS = parseOrigins(process.env.CORS_FULL_ACCESS_ORIGINS, [
    'http://localhost:8000',
    `http://localhost:${defaultPort}`,
]);
const CLINICAL_INFO_ORIGINS = parseOrigins(process.env.CORS_CLINICAL_INFO_ORIGINS, ['http://localhost:8002']);

const clinicalInfoPatterns = [
    /^\/clinical-records(?:\/[0-9a-fA-F-]+)?$/,
    /^\/patients(?:\/[0-9a-fA-F-]+)?$/, 
    /^\/patients\/[0-9a-fA-F-]+\/clinical-records$/,
];
const isClinicalInfoRequest = (req: CorsRequest): boolean => {
    const method = req.method === 'OPTIONS' ? (req.headers['access-control-request-method'] ?? 'GET') : req.method;
    if (method !== 'GET') {
        return false;
    }
    const path = (req as Request).url?.split('?')[0] ?? '/';
    return clinicalInfoPatterns.some((pattern) => pattern.test(path));
};
export const corsMiddleware = cors((req, callback) => {
    const origin = req.headers['origin'];
    if (!origin) {
        return callback(null, { origin: false });
    }
    if (FULL_ACCESS_ORIGINS.has(origin)) {
        return callback(null, {
            origin: true,
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
    }
    if (CLINICAL_INFO_ORIGINS.has(origin) && isClinicalInfoRequest(req)) {
        return callback(null, {
            origin: true,
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
    }
    return callback(null, { origin: false });
});
