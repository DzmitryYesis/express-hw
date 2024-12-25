import {TDevice} from "../../types";
import {ObjectId} from "mongodb";
import {SessionModel} from "../../db";
import {injectable} from "inversify";

@injectable()
export class QueryDevicesRepository {
    async getUserDevices(userId: string): Promise<TDevice[]> {
        const devices = await SessionModel.find({userId: new ObjectId(userId)}).lean();

        return devices.map(d => ({
            ip: d.ip,
            title: d.deviceName,
            lastActiveDate: new Date(d.iat * 1000).toISOString(),
            deviceId: d.deviceId,
        }))
    }
}