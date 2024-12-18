import {blogsCollection, commentsCollection, postsCollection, sessionsCollection, usersCollection} from '../../db';

export const testingRepository = {
    async deleteAllData() {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await usersCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await sessionsCollection.deleteMany({});
    }
}