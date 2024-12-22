import {TDevice} from "../../types";
import {ObjectId} from "mongodb";
import {SessionModel} from "../../db/models";

export const queryDevicesRepository = {
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