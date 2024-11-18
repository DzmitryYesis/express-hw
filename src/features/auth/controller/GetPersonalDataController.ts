import {Request, Response} from "express";
import {queryUsersRepository} from "../../users";
import {StatusCodeEnum} from "../../../constants";
import {TPersonalData} from "../../../types";

export const GetPersonalDataController = async (req: Request, res: Response<TPersonalData>) => {
    const personalData = await queryUsersRepository.getUserPersonalData(req.userId!);

    res
        .status(StatusCodeEnum.OK_200)
        .json(personalData!);
}