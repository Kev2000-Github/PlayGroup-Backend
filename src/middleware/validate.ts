import { validationResult } from "express-validator";
import { httpCodes } from "../utils/constants/httpResponseCodes";

export function validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const extractedErrors = [];
    // @ts-ignore
    errors.array().forEach(err => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(httpCodes.UNPROCESSABLE_ENTITY).json({
        errors: extractedErrors,
    })
}