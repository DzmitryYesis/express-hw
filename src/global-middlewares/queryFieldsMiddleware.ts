import {NextFunction, Response} from "express";
import {matchedData} from "express-validator";
import {RequestWithQuery} from "../types/requestTypes";
import {TBlogsQuery, TCommentsQuery, TPostsQuery, TUsersQuery} from "../features/types";

export const queryFieldsMiddleware = (req: RequestWithQuery<TBlogsQuery | TPostsQuery | TUsersQuery | TCommentsQuery>, res: Response, next: NextFunction) => {
    req.query = matchedData(req);
    next()
}