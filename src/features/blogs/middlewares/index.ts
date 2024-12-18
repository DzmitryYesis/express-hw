import {body, param, query} from 'express-validator';
import {querySortBy} from "../../../constants";

export const blogNameValidator = body('name')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1, max: 15})
    .withMessage('Length must be from 1 to 15')

export const blogDescriptionValidator = body('description')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1, max: 500})
    .withMessage('Length must be from 1 to 500')

export const blogWebsiteUrlValidator = body('websiteUrl')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1, max: 100})
    .withMessage('Length must be from 1 to 100')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('It is invalid structure of url')

export const blogIdValidator = param('id')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId')

export const blogQueriesValidator = [
    query('searchNameTerm').trim().optional().isString(),
    query('sortBy').trim().optional().isIn(querySortBy.blogs),
    query('sortDirection').trim().optional().isIn(['asc', 'desc']),
    query('pageNumber').trim().optional().toInt().isInt(),
    query('pageSize').trim().optional().toInt().isInt()
]