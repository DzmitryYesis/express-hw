import {Request, Response} from "express";
import {QueryDevicesRepository} from "../QueryDevicesRepository";
import {HttpStatusCodeEnum} from "../../../constants";
import {RequestWithParam, TDevice} from "../../../types/";
import {UsersService} from "../UsersService";
import {SETTINGS} from "../../../settings";

export class SecurityController {
    constructor(
        protected queryDevicesRepository: QueryDevicesRepository,
        protected usersService: UsersService,
    ) {
    }

    async getDevices(req: Request, res: Response<TDevice[]>) {
        const devicesData = await this.queryDevicesRepository.getUserDevices(req.userId!);

        res
            .status(HttpStatusCodeEnum.OK_200)
            .json(devicesData);
    }

    async deleteDevice(req: RequestWithParam<{ deviceId: string }>, res: Response) {
        const {
            result,
            status
        } = await this.usersService.deleteDeviceById(req.params.deviceId, req.userId!);

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
        } else {
            if (status === "FORBIDDEN") {
                res.status(HttpStatusCodeEnum.FORBIDDEN_403).end();
            } else {
                res.status(HttpStatusCodeEnum.NOT_FOUND_404).end();
            }
        }
    }

    async deleteDevicesExcludeCurrent(req: Request, res: Response) {
        const {result} = await this.usersService.deleteDevicesExcludeCurrent(req.cookies[SETTINGS.REFRESH_TOKEN_NAME].replace('refreshToken=', ''));

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }
}