import mongoose from "mongoose";
import {TBlogDB, TCommentDB, TLogRequestsDB, TPostDB, TSessionsDB, TUserDB} from "./types";
import {BlogSchema, CommentSchema, LogRequestSchema, PostSchema, SessionSchema, UserSchema} from "./schemas";

export const BlogModel = mongoose.model<TBlogDB>('blog', BlogSchema);
export const PostModel = mongoose.model<TPostDB>('post', PostSchema);
export const UserModel = mongoose.model<TUserDB>('user', UserSchema);
export const CommentModel = mongoose.model<TCommentDB>('comment', CommentSchema);
export const SessionModel = mongoose.model<TSessionsDB>('session', SessionSchema);
export const LogRequestModel = mongoose.model<TLogRequestsDB>('logRequest', LogRequestSchema);