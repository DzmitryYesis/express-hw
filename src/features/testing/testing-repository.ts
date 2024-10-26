import {blogsCollection, postsCollection} from '../../db';


export const testingRepository = {
   async deleteAllData() {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
    }
}