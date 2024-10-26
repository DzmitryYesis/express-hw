import {blogsCollection, postsCollection, TPost} from '../../db';
import {TInputPost} from '../blogs/types';

export const postsRepository = {
    async getPosts(): Promise<TPost[]> {
        const posts = await postsCollection.find().toArray();

        return posts.map(p => ({
            id: p.id,
            title: p.title,
            content: p.content,
            shortDescription: p.shortDescription,
            blogName: p.blogName,
            blogId: p.blogId
        }))
    },
    async getPostById(id: string): Promise<TPost | null> {
        const post = await postsCollection.findOne({id});

        if (post) {
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogName: post.blogName,
                blogId: post.blogId
            }
        }

        return null
    },
    async createPost(data: TInputPost): Promise<TPost | null> {
        const blog = await blogsCollection.findOne({id: data.blogId})

        if (blog) {
            const newPost: TPost = {
                id: Date.now().toString(),
                blogName: blog.name,
                ...data
            }

            await postsCollection.insertOne(newPost);

            return {
                id: newPost.id,
                title: newPost.title,
                content: newPost.content,
                shortDescription: newPost.shortDescription,
                blogName: newPost.blogName,
                blogId: newPost.blogId
            };
        }

        return null
    },
    async updatePostById(id: string, data: TInputPost): Promise<boolean> {
        const result = await postsCollection.updateOne({id}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})

        return result.deletedCount === 1
    }
}