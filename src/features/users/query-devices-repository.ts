import {sessionsCollection} from "../../db";
import {TDevice} from "../../types";
import {ObjectId} from "mongodb";

export const queryDevicesRepository = {
    async getUserDevices(userId: string): Promise<TDevice[]> {
        const devices = await sessionsCollection.find({userId: new ObjectId(userId)}).toArray();

        return devices.map(d => ({
            ip: d.ip,
            title: d.deviceName,
            lastActiveDate: new Date(d.iat * 1000).toISOString(),
            deviceId: d.deviceId,
        }))
    }
}