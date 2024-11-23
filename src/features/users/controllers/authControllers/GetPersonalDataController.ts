import {Request, Response} from "express";
import {queryUsersRepository} from "../../query-users-repository";
import {HttpStatusCodeEnum} from "../../../../constants";
import {TPersonalData} from "../../../../types";

export const GetPersonalDataController = async (req: Request, res: Response<TPersonalData>) => {
    const personalData = await queryUsersRepository.getUserPersonalData(req.userId!);

    res
        .status(HttpStatusCodeEnum.OK_200)
        .json(personalData!);
}