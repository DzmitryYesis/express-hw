import {config} from 'dotenv'

config()

export const SETTINGS = {
    PORT: process.env.PORT,
    REFRESH_TOKEN_NAME: 'refreshToken',
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET || 'qwerqwer',
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || 'sfghsftbhsf',
    JWT_ACCESS_TOKEN_EXPIRES_TIME: '10s',
    JWT_REFRESH_TOKEN_EXPIRES_TIME: '20s',
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        AUTH: '/auth',
        SECURITY: '/security',
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
    DB_COLLECTION_SESSIONS_NAME: 'sessionsCollection',
    DB_COLLECTION_LOG_REQUESTS_NAME: 'logRequestsCollection',
}