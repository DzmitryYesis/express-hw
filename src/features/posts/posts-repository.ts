import {db, TPost} from '../../db';
import {TInputPost} from '../blogs/types';
import {blogsRepository} from '../blogs';

export const postsRepository = {
    getPosts() {
        return db.posts
    },
    getPostById(id: string) {
        return db.posts.find(p => p.id === id)
    },
    createPost(data: TInputPost) {
        const newPost: TPost = {
            id: Date.now().toString(),
            blogName: blogsRepository.getBlogById(data.blogId)?.name!,
            ...data
        }

        db.posts.push(newPost)

        return newPost;
    },
    updatePostById(id: string, data: TInputPost) {
        const post = this.getPostById(id);

        if (post) {
            db.posts = db.posts.map(p => p.id === id ? {...p, ...data} : p)
            return true
        } else {
            return false
        }
    },
    deletePost(id: string) {
        const post = this.getPostById(id);

        if (post) {
            const index = db.posts.indexOf(post);
            db.posts.splice(index, 1);
            return true
        } else {
            return false
        }
    }
}