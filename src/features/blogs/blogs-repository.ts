import {db, TBlog} from '../../db';
import {TInputBlog} from './types';

export const blogsRepository = {
    async getBlogs(): Promise<TBlog[]> {
        return db.blogs
    },
    async getBlogById(id: string): Promise<TBlog | undefined> {
        return db.blogs.find(b => b.id === id)
    },
    async createBlog(data: TInputBlog): Promise<TBlog> {
        const newBlog = {
            id: Date.now().toString(),
            ...data
        }

        db.blogs.push(newBlog);

        return newBlog
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        const blog = await this.getBlogById(id);

        if (blog) {
            db.blogs = db.blogs.map(b => b.id === id ? {...b, ...data} : b)
            return true
        } else {
            return false
        }
    },
    async deleteBlog(id: string): Promise<boolean> {
        const blog = await this.getBlogById(id);

        if (blog) {
            const index = db.blogs.indexOf(blog);
            db.blogs.splice(index, 1);
            return true
        } else {
            return false
        }
    }
}