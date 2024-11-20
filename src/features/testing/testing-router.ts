import {Router, Request, Response} from 'express';
import {HttpStatusCodeEnum} from '../../constants';
import {testingRepository} from "./testing-repository";

export const testingRouter = Router();

const testingController = {
    deleteAllData: async (req: Request, res: Response) => {
        await testingRepository.deleteAllData();

        res
            .status(HttpStatusCodeEnum.NO_CONTENT_204)
            .end()
    }
}

testingRouter.delete('/', testingController.deleteAllData)