import {TestingRepository} from "./TestingRepository";
import {Request, Response} from "express";
import {HttpStatusCodeEnum} from "../../constants";
import {inject, injectable} from "inversify";

@injectable()
export class TestingController {
    constructor(@inject(TestingRepository) protected testingRepository: TestingRepository) {}

    async deleteAllData(req: Request, res: Response) {
        await this.testingRepository.deleteAllData();

        res
            .status(HttpStatusCodeEnum.NO_CONTENT_204)
            .end()
    }
}