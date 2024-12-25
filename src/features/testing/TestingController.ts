import {TestingRepository} from "./TestingRepository";
import {Request, Response} from "express";
import {HttpStatusCodeEnum} from "../../constants";

export class TestingController {
    constructor(protected testingRepository: TestingRepository ) {
    }

    async deleteAllData(req: Request, res: Response) {
        await this.testingRepository.deleteAllData();

        res
            .status(HttpStatusCodeEnum.NO_CONTENT_204)
            .end()
    }
}