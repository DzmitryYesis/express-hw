import {Request, Response} from "express";
import {TDevice} from "../../../../types";
import {HttpStatusCodeEnum} from "../../../../constants";
import {queryDevicesRepository} from "../../query-devices-repository";

export const GetDevicesController = async (req: Request, res: Response<TDevice[]>) => {
    const devicesData = await queryDevicesRepository.getUserDevices(req.userId!);

    res
        .status(HttpStatusCodeEnum.OK_200)
        .json(devicesData);
}