import type { Request } from 'express';
import cors, { type CorsRequest } from 'cors';

const FULL_ACCESS_ORIGINS = new Set(['http://localhost:8000']);
const CLINICAL_INFO_ORIGINS = new Set(['http://localhost:8002']);

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
