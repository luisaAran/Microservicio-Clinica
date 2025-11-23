import type { Request, RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';
import { ApiError } from '../../../utils/ApiError.js';

export type ValidatedPayload<
    Body = unknown,
    Params = unknown,
    Query = unknown
> = {
    body: Body;
    params: Params;
    query: Query;
};

export type ValidatedRequest<
    Body = unknown,
    Params = unknown,
    Query = unknown
> = Request & {
    validated: ValidatedPayload<Body, Params, Query>;
};

interface ValidationSchemas {
    body?: ZodTypeAny;
    params?: ZodTypeAny;
    query?: ZodTypeAny;
}

export const validateRequest = (schemas: ValidationSchemas): RequestHandler => {
    return (req, _res, next) => {
        const request = req as ValidatedRequest;

        try {
            const body = schemas.body ? schemas.body.parse(req.body) : undefined;
            const params = schemas.params ? schemas.params.parse(req.params) : undefined;
            const query = schemas.query ? schemas.query.parse(req.query) : undefined;

            request.validated = {
                body,
                params,
                query,
            };

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(error);
            }

            return next(new ApiError(400, 'Invalid request data'));
        }
    };
};
