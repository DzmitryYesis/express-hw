import {TLogRequestsDB, LogRequestModel} from "../../db";
import {injectable} from "inversify";

@injectable()
export class LogRequestsRepository {
    async addLogRequest(data: Omit<TLogRequestsDB, '_id'>) {
        const result = await LogRequestModel.create({...data} as TLogRequestsDB);

        return result._id.toString();
    }

    async countLogRequest(data: Omit<TLogRequestsDB, '_id'>) {
        return LogRequestModel.countDocuments({
            ip: data.ip,
            url: data.url,
            date: {$gte: data.date},
        })
    }
}