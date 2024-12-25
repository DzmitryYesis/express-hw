import {body, param, query} from 'express-validator';
import {querySortBy} from "../../../constants";
import {blogsService} from "../../../composition-root";

export const postTitleValidator = body('title')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1, max: 30})
    .withMessage('Length must be from 1 to 30')

export const postShortDescriptionValidator = body('shortDescription')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1, max: 100})
    .withMessage('Length must be from 1 to 100')

export const postContentValidator = body('content')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1, max: 1000})
    .withMessage('Length must be from 1 to 1000')

export const postIdValidator = param('id')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId')

export const postBlogIdValidator = body('blogId')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1})
    .withMessage('Min length must be 1')
    .custom(async (blogId) => {
        const {result} = await blogsService.findBlogById(blogId);
        if (result === "REJECT") {
            throw new Error('Blog not found')
        }
    })

export const postsQueriesValidator = [
    query('sortBy').trim().optional().isIn(querySortBy.posts),
    query('sortDirection').trim().optional().isIn(['asc', 'desc']),
    query('pageNumber').trim().optional().toInt().isInt(),
    query('pageSize').trim().optional().toInt().isInt()
]
