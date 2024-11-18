import {postsCollection} from '../../db';
import {TInputPost, TPost} from '../../types';
import {ObjectId, OptionalId} from 'mongodb';

export const postsRepository = {
    async createPost(data: Omit<TPost, 'id'>): Promise<string> {
        //TODO fix problem with type
        // @ts-ignore
        const result = await postsCollection.insertOne(data as OptionalId<TPost>);

        return result.insertedId.toString();
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