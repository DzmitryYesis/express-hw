import {db} from '../db';

export const blogsRepository = {
    getBlogs() {
        return db.blogs
    }
}