import {body} from "express-validator";

export const authLoginOrEmailValidator = body('loginOrEmail')
    .trim()
    .isString()
    .withMessage('Must be a string')

export const authConfirmationCodeValidator = body('code')
    .trim()
    .isString()
    .withMessage('Must be a string')

export const authLoginValidator = body('login')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 3, max: 10})
    .withMessage('Length must be from 3 to 10')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Incorrect value')

export const authEmailValidator = body('email')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Incorrect value')

export const authPasswordValidator = body('password')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 6, max: 20})
    .withMessage('Length must be from 6 to 20')