import {Router, Request, Response} from 'express';
import {testingRepository} from './testing-repository';
import {StatusCodeEnum} from '../../constants';

export const testingRouter = Router();

const testingController = {
    deleteAllData: async (req: Request, res: Response) => {
        await testingRepository.deleteAllData();

        res
            .status(StatusCodeEnum.NO_CONTENT_204)
            .end()
    }
}

testingRouter.delete('/', testingController.deleteAllData)