import {body, query} from "express-validator";
import {querySortBy} from "../../../../constants";

export const userLoginValidator = body('login')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 3, max: 10})
    .withMessage('Length must be from 3 to 10')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Incorrect value')

export const userPasswordValidator = body('password')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 6, max: 20})
    .withMessage('Length must be from 6 to 20')

export const userEmailValidator = body('email')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Incorrect value')

export const usersQueriesValidator = [
    query('searchLoginTerm').trim().optional().isString(),
    query('searchEmailTerm').trim().optional().isString(),
    query('sortBy').trim().optional().isIn(querySortBy.users),
    query('sortDirection').trim().optional().isIn(['asc', 'desc']),
    query('pageNumber').trim().optional().toInt().isInt(),
    query('pageSize').trim().optional().toInt().isInt()
]