import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import {SETTINGS} from './settings';
import {
    blogsRouter,
    postsRouter,
    authRouter,
    userRouter,
    testingRouter,
    commentsRouter
} from './features';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.USERS, userRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);