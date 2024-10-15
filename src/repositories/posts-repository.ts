import {db} from '../db';

export const postsRepository = {
    getPosts() {
        return db.posts
    }
}