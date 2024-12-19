import {Response} from 'express';
import {usersService} from "../../users-service";
import {HttpStatusCodeEnum} from "../../../../constants";
import {RequestWithParam} from "../../../../types";

export const DeleteDeviceByIdController = async (req: RequestWithParam<{ deviceId: string }>, res: Response) => {
    const {
        result,
        status
    } = await usersService.deleteDeviceById(req.params.deviceId, req.userId!);

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