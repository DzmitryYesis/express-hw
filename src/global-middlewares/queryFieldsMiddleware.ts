import {NextFunction, Response} from "express";
import {matchedData} from "express-validator";
import {
    RequestWithQuery,
    TBlogsQuery,
    TCommentsQuery,
    TPostsQuery,
    TUsersQuery
} from "../types";

export const queryFieldsMiddleware = (req: RequestWithQuery<TBlogsQuery | TPostsQuery | TUsersQuery | TCommentsQuery | {}>, res: Response, next: NextFunction) => {
    req.query = matchedData(req);
    next()
}