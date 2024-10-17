import {body} from 'express-validator';
import {blogsRepository} from '../../blogs';

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
    .isLength({min: 1, max: 100})
    .withMessage('Length must be from 1 to 100')

export const postBlogIdValidator = body('blogId')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 1})
    .withMessage('Min length must be 1')
    .custom(blogId => {
        const blog = blogsRepository.getBlogById(blogId)
        return !!blog
    }).withMessage('Blog not found')
