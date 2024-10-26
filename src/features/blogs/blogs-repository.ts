import {blogsCollection, TBlog} from '../../db';
import {TInputBlog} from './types';

export const blogsRepository = {
    async getBlogs(): Promise<TBlog[]> {
        const blogs = await blogsCollection.find().toArray();

        return blogs.map(b => ({
            id: b.id,
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl
        }))
    },
    async getBlogById(id: string): Promise<TBlog | null> {
        const blog = await blogsCollection.findOne({id});

        if (blog) {
            return {
                id: blog.id,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl
            }
        }
        return null
    },
    async createBlog(data: TInputBlog): Promise<TBlog> {
        const newBlog = {
            id: Date.now().toString(),
            ...data
        }

        await blogsCollection.insertOne(newBlog)

        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl
        }
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        const result = await blogsCollection.updateOne({id}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id})

        return result.deletedCount === 1
    }
}