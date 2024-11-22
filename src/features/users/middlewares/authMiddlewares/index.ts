import {body} from "express-validator";

export const authLoginOrEmailValidator = body('loginOrEmail')
    .trim()
    .isString()
    .withMessage('Must be a string')

export const authPasswordValidator = body('password')
    .trim()
    .isString()
    .withMessage('Must be a string')
    .isLength({min: 6, max: 20})
    .withMessage('Length must be from 6 to 20')