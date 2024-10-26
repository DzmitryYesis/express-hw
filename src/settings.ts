import {config} from 'dotenv'

config()

export const SETTINGS = {
    PORT: process.env.PORT,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data'
    },
    AUTH_BASIC: 'admin:qwerty',
    MONGO_URL: 'mongodb://localhost:27017',
    DB_NAME: 'incubator',
    DB_COLLECTION_BLOGS_NAME: 'blogsCollection',
    DB_COLLECTION_POSTS_NAME: 'postsCollection'
}