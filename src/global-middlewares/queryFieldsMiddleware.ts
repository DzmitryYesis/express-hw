import {NextFunction, Request, Response} from "express";
import {matchedData} from "express-validator";
import {RequestWithQuery} from "../types";
import {TBlogsQuery, TPostsQuery} from "../features/types";

export const queryFieldsMiddleware = (req: RequestWithQuery<TBlogsQuery | TPostsQuery>, res: Response, next: NextFunction) => {
    req.query = matchedData(req);
    next()
}