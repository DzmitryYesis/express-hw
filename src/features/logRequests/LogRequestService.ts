import {TLogRequestsDB} from "../../db";
import {LogRequestsRepository} from "./LogRequestsRepository";
import {createServiceResultObj} from "../../utils";
import {TResultServiceObj} from "../../types";

export class LogRequestService {
    constructor(protected logRequestsRepository: LogRequestsRepository) {}

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