import {db} from '../../db';

export const postsRepository = {
    getPosts() {
        return db.posts
    },
    getPostById(id: string) {
        return db.posts.find(p => p.id === id)
    }
}