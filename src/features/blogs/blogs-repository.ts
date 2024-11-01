import {blogsCollection, TBlog} from '../../db';
import {TInputBlog} from './types';
import {ObjectId, OptionalId} from 'mongodb';

export const blogsRepository = {
    async getBlogs(): Promise<TBlog[]> {
        const blogs = await blogsCollection.find().toArray();

        return blogs.map(b => ({
            id: b._id.toString(),
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt,
            isMembership: b.isMembership
        }))
    },
    async getBlogById(id: string): Promise<TBlog | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)});

        if (blog) {
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            }
        }

        return null
    },
    async createBlog(data: Omit<TBlog, 'id'>): Promise<TBlog> {
        const result = await blogsCollection.insertOne(data as OptionalId<TBlog>);

        return {
            id: result.insertedId.toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: data.createdAt,
            isMembership: data.isMembership
        }
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}