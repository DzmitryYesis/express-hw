import {blogsCollection, postsCollection, TPost} from '../../db';
import {TInputPost} from '../blogs/types';
import {ObjectId} from 'mongodb';

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
    async createPost(data: TInputPost): Promise<TPost> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(data.blogId)})

        if (blog) {
            const newPost: TPost = {
                id: Date.now().toString(),
                blogName: blog.name,
                createdAt: new Date().toISOString(),
                ...data
            }

           const result = await postsCollection.insertOne(newPost);

            return {
                id: result.insertedId.toString(),
                title: newPost.title,
                content: newPost.content,
                shortDescription: newPost.shortDescription,
                blogName: newPost.blogName,
                blogId: newPost.blogId,
                createdAt: newPost.createdAt
            };
        }

        throw new Error('Oops!')
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