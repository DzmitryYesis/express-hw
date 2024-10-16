import {db} from '../../db';

export const blogsRepository = {
    getBlogs() {
        return db.blogs
    },
    getBlogById(id: string) {
        return db.blogs.find(b => b.id === id)
    }
}