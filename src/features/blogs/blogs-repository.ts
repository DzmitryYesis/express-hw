import {TBlogDB} from '../../db';
import {TInputBlog} from '../../types';
import {ObjectId} from 'mongodb';
import {BlogModel} from "../../db/models";

export const blogsRepository = {
    async createBlog(data: Omit<TBlogDB, '_id'>): Promise<string> {
        const result = await BlogModel.create({...data} as TBlogDB);

        return result._id.toString();
    },
    async findBlogById(id: string): Promise<TBlogDB | null> {
        return BlogModel.findOne({_id: new ObjectId(id)});
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        const result = await BlogModel.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}