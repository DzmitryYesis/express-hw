import {body, query} from "express-validator";
import {querySortBy} from "../../../constants";

export const comments = [
    query('sortBy').trim().optional().isIn(querySortBy.comments),
    query('sortDirection').trim().optional().isIn(['asc', 'desc']),
    query('pageNumber').trim().optional().toInt().isInt(),
    query('pageSize').trim().optional().toInt().isInt()
]

export const commentContentValidator = body('content')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 20, max: 300})
    .withMessage('Length must be from 20 to 300')

export const commentLikeValidator = body('likeStatus')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isIn(['Like', 'Dislike', 'None'])
    .withMessage('Must be a string');
