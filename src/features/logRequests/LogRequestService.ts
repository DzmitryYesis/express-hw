import {TLogRequestsDB} from "../../db";
import {LogRequestsRepository} from "./LogRequestsRepository";
import {createServiceResultObj} from "../../utils";
import {TResultServiceObj} from "../../types";
import {inject, injectable} from "inversify";

@injectable()
export class LogRequestService {
    constructor(@inject(LogRequestsRepository) protected logRequestsRepository: LogRequestsRepository) {}

    async addLogRequest(data: Omit<TLogRequestsDB, '_id'>): Promise<TResultServiceObj> {
        const result = await this.logRequestsRepository.addLogRequest(data);

        if (!result) {
            return createServiceResultObj("REJECT", 'BAD_REQUEST')
        }

        return createServiceResultObj("SUCCESS", 'CREATED')
    }

    async countLogRequest(data: Omit<TLogRequestsDB, '_id'>): Promise<TResultServiceObj> {
        const count = await this.logRequestsRepository.countLogRequest(data);

        if (count > 5) {
            return createServiceResultObj("REJECT", 'TO_MANY_REQUESTS')
        }

        return createServiceResultObj("SUCCESS", 'OK')
    }
}