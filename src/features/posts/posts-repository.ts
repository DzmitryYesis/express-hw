import {postsCollection, TPost} from '../../db';
import {TInputPost} from '../blogs/types';
import {ObjectId, OptionalId} from 'mongodb';

export const postsRepository = {
    async getPosts(): Promise<TPost[]> {
        const posts = await postsCollection.find().toArray();

        return posts.map(p => ({
            id: p._id.toString(),
            title: p.title,
            content: p.content,
            shortDescription: p.shortDescription,
            blogName: p.blogName,
            blogId: p.blogId,
            createdAt: p.createdAt
        }))
    },
    async getPostById(id: string): Promise<TPost | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)});

        if (post) {
            return {
                id: post._id.toString(),
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogName: post.blogName,
                blogId: post.blogId,
                createdAt: post.createdAt
            }
        }

        return null
    },
    async createPost(data: Omit<TPost, 'id'>): Promise<TPost> {
        const result = await postsCollection.insertOne(data as OptionalId<TPost>);

        return {
            id: result.insertedId.toString(),
            title: data.title,
            content: data.content,
            shortDescription: data.shortDescription,
            blogName: data.blogName,
            blogId: data.blogId,
            createdAt: data.createdAt
        };
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