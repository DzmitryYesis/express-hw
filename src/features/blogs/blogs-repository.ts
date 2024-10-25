import {db} from '../../db';
import {TInputBlog} from './types';

export const blogsRepository = {
    getBlogs() {
        return db.blogs
    },
    getBlogById(id: string) {
        return db.blogs.find(b => b.id === id)
    },
    createBlog(data: TInputBlog) {
        const newBlog = {
            id: Date.now().toString(),
            ...data
        }

        db.blogs.push(newBlog);

        return newBlog
    },
    updateBlogById(id: string, data: TInputBlog) {
        const blog = this.getBlogById(id);

        if (blog) {
            db.blogs = db.blogs.map(b => b.id === id ? {...b, ...data} : b)
            return true
        } else {
            return false
        }
    },
    deleteBlog(id: string) {
        const blog = this.getBlogById(id);

        if (blog) {
            const index = db.blogs.indexOf(blog);
            db.blogs.splice(index, 1);
            return true
        } else {
            return false
        }
    },
    createAndDelete(data: TInputBlog ,id: string) {
        const newBlog = this.createBlog(data);
        return this.deleteBlog(newBlog.id)
    }
}