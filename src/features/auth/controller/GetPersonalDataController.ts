import {Request, Response} from "express";
import {usersService} from "../../users/users-service";
import {StatusCodeEnum} from "../../../constants";

export const GetPersonalDataController = async (req: Request, res: Response) => {
    const personalData = await usersService.getUserById(req.userId!);

    res
        .status(StatusCodeEnum.OK_200)
        .json(personalData);
}