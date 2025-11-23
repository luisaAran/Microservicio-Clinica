import { randomUUID } from 'crypto';
import pinoHttp from 'pino-http';
import type { IncomingMessage, ServerResponse } from 'http';
import { logger } from '../../../utils/logger.js';

const requestSerializer = (req: IncomingMessage) => ({
    id: (req as any).id,
    method: req.method,
    url: req.url,
});

const responseSerializer = (res: ServerResponse) => ({
    id: (res as any).req?.id,
    statusCode: res.statusCode,
});

export const requestLogger = pinoHttp({
    logger,
    genReqId: (req) => {
        const headerId = req.headers['x-request-id'];
        if (headerId && typeof headerId === 'string') {
            return headerId;
        }
        if (Array.isArray(headerId)) {
            return headerId[0];
        }
        return randomUUID();
    },
    serializers: {
        req: requestSerializer,
        res: responseSerializer,
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} -> ${res.statusCode}`,
    customErrorMessage: (req, res, err) => `${req.method} ${req.url} -> ${res.statusCode} | ${err.message}`,
});
