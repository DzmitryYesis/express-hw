import {ServiceStatusEnum, ServiceStatusCodeEnum} from "../constants";

export type TResultServiceObj<T = undefined> = {
    result: keyof typeof ServiceStatusEnum,
    status: keyof typeof ServiceStatusCodeEnum,
    data?: T
}