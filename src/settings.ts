import {config} from 'dotenv'

config()

export const SETTINGS = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET || 'qwerqwer',
    JWT_EXPIRES_TIME: '10m',
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        AUTH: '/auth',
        COMMENTS: '/comments',
        TESTING: '/testing/all-data'
    },
    AUTH_BASIC: 'admin:qwerty',
    MONGO_URL: 'mongodb://localhost:27017',
    DB_NAME: 'incubator',
    DB_COLLECTION_BLOGS_NAME: 'blogsCollection',
    DB_COLLECTION_POSTS_NAME: 'postsCollection',
    DB_COLLECTION_USERS_NAME: 'usersCollection',
    DB_COLLECTION_COMMENTS_NAME: 'commentsCollection',
}