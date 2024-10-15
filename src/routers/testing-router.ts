import {Router, Request, Response} from 'express';
import {StatusCodeEnum} from '../constans';
import {testingRepository} from '../repositories';

export const testingRouter = Router();

const testingController = {
    deleteAllData: (req: Request, res: Response) => {
        testingRepository.deleteAllData();

        res
            .status(StatusCodeEnum.NO_CONTENT_204)
            .end()
    }
}

testingRouter.delete('/', testingController.deleteAllData)