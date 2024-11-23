import {postsCollection, TPostDB} from '../../db';
import {TInputPost} from '../../types';
import {ObjectId} from 'mongodb';

export const postsRepository = {
    async createPost(data: Omit<TPostDB, '_id'>): Promise<string> {
        const result = await postsCollection.insertOne({...data} as TPostDB);

        return result.insertedId.toString();
    },
    async findPostById(id: string): Promise<TPostDB | null> {
        return await postsCollection.findOne({_id: new ObjectId(id)});
    },
    async updatePostById(id: string, data: TInputPost): Promise<boolean> {
        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}