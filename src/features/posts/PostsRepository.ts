import {TPostDB, PostModel} from '../../db';
import {TInputPost} from '../../types';
import {ObjectId} from 'mongodb';

export class PostsRepository {
    async createPost(data: Omit<TPostDB, '_id'>): Promise<string> {
        const result = await PostModel.create({...data} as TPostDB);

        return result._id.toString();
    }

    async findPostById(id: string): Promise<TPostDB | null> {
        return PostModel.findOne({_id: new ObjectId(id)});
    }

    async updatePostById(id: string, data: TInputPost): Promise<boolean> {
        const result = await PostModel.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}
