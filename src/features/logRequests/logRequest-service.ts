import {TLogRequestsDB} from "../../db";
import {logRequestsRepository} from "./logRequests-repository";
import {createServiceResultObj} from "../../utils";
import {TResultServiceObj} from "../../types";

export const logRequestService = {
    async addLogRequest(data: Omit<TLogRequestsDB, '_id'>): Promise<TResultServiceObj> {
        const result = await logRequestsRepository.addLogRequest(data);

        if (!result) {
            return createServiceResultObj("REJECT", 'BAD_REQUEST')
        }

        return createServiceResultObj("SUCCESS", 'CREATED')
    },
    async countLogRequest(data: Omit<TLogRequestsDB, '_id'>): Promise<TResultServiceObj> {
        const count = await logRequestsRepository.countLogRequest(data);

        if (count > 5) {
            return createServiceResultObj("REJECT", 'TO_MANY_REQUESTS')
        }

        return createServiceResultObj("SUCCESS", 'OK')
    }
}