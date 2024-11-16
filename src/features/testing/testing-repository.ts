import {blogsCollection, postsCollection, usersCollection} from '../../db';


export const testingRepository = {
    async deleteAllData() {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})
    }
}