import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import {SETTINGS} from './settings';
import {blogsRouter} from "./features/blogs/blogs-router";
import {postsRouter} from "./features/posts/posts-router";
import {authRouter, securityRouter, userRouter} from "./features/users/routers";
import {commentsRouter} from "./features/comments/comments-router";
import {testingRouter} from "./features/testing/testing-router";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set('trust proxy', true);

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.USERS, userRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.SECURITY, securityRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);