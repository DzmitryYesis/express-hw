import {blogsCollection, TBlogDB} from '../../db';
import {TBlog, TInputBlog} from '../../types';
import {ObjectId, OptionalId} from 'mongodb';

export const blogsRepository = {
    async createBlog(data: Omit<TBlog, 'id'>): Promise<string> {
        //TODO fix problem with type
        // @ts-ignore
        const result = await blogsCollection.insertOne(data as OptionalId<TBlog>);

        return result.insertedId.toString();
    },
    async findBlogById(id: string): Promise<TBlogDB | null> {
        return await blogsCollection.findOne({_id: new ObjectId(id)});
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