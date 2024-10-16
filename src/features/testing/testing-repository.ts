import {db, TDataBase} from '../../db';

export const testingRepository = {
    deleteAllData() {
        Object.keys(db).forEach((key) => {
            db[key as keyof TDataBase] = []
        })
    }
}