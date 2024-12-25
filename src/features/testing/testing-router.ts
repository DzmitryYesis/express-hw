import {Router} from 'express';
import {container} from "../../composition-root";
import {TestingController} from "./TestingController";

export const testingRouter = Router();

const testingController = container.get(TestingController);

testingRouter.delete('/', testingController.deleteAllData.bind(testingController));