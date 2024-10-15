import {config} from 'dotenv'
config()

export const SETTINGS = {
    PORT: process.env.PORT,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data'
    }
}