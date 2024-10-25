import {db, TPost} from '../../db';
import {TInputPost} from '../blogs/types';
import {blogsRepository} from '../blogs';

export const postsRepository = {
    async getPosts(): Promise<TPost[]> {
        return db.posts
    },
    async getPostById(id: string): Promise<TPost | undefined> {
        return db.posts.find(p => p.id === id)
    },
    async createPost(data: TInputPost): Promise<TPost> {
        const blog = await blogsRepository.getBlogById(data.blogId)

        const newPost: TPost = {
            id: Date.now().toString(),
            blogName: blog!.name,
            ...data
        }

        db.posts.push(newPost)

        return newPost;
    },
    async updatePostById(id: string, data: TInputPost): Promise<boolean> {
        const post = await this.getPostById(id);

        if (post) {
            db.posts = db.posts.map(p => p.id === id ? {...p, ...data} : p)
            return true
        } else {
            return false
        }
    },
    async deletePost(id: string): Promise<boolean> {
        const post = await this.getPostById(id);

        if (post) {
            const index = db.posts.indexOf(post);
            db.posts.splice(index, 1);
            return true
        } else {
            return false
        }
    }
}