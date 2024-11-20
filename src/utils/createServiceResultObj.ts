import {ServiceStatusCodeEnum, ServiceStatusEnum} from "../constants";
import {TResultServiceObj} from "../types/resultObj";

export const createServiceResultObj = <T = undefined>(
    result: keyof typeof ServiceStatusEnum,
    status: keyof typeof ServiceStatusCodeEnum,
    data?: T
): TResultServiceObj<T> => ({
    result,
    status,
    data
});