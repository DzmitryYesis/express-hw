import {body} from 'express-validator';

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
    .withMessage('Length must be from 1 to 500')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('It is noe email')