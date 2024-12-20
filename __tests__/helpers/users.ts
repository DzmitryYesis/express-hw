import {TInputLogin, TInputUser} from "../../src/types/inputModels";
import {SETTINGS} from "../../src/settings";
import {authBasic, req} from "./test-helper";
import {TLoginUser, TUser} from "../../src/types/viewModels";

export const invalidRefreshToken = 'refreshToken=invalidtoken';
export const invalidCode = 'b904fd57-f1d1-4fd9-8c28-8363b1blabla';

export const createUserInputBody = (index: number) => ({
    login: `login_${index}`,
    password: `password_${index}`,
    email: `email${index}@gmail.com`
} as TInputUser)

export const createdUser = async (index: number) => {
    const user = createUserInputBody(index)

    const res = await req.post(SETTINGS.PATH.USERS)
        .set('authorization', `Basic ${authBasic}`)
        .send(user)

    return {user: res.body as TUser, password: user.password};
}

export const createdUsers = async (indexes: number) => {
    const usersArray = [] as TUser[];
    for (let i = 1; i <= indexes; i++) {
        const res = await req.post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
            .send(createUserInputBody(i))

        usersArray.unshift(res.body as TUser);
    }

    return usersArray as TUser[];
}

export const loggedInUser = async (index: number = 1, deviceName: string = 'Default device') => {
    const {user, password} = await createdUser(index);

    const res = await req.post(`${SETTINGS.PATH.AUTH}/login`)
        .set('User-Agent', deviceName)
        .send({loginOrEmail: user.login, password} as TInputLogin)

    const {accessToken} = res.body as TLoginUser;

    const cookies = res.headers['set-cookie'] as unknown as string[];
    const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

    return {accessToken, refreshTokenCookie, user}
}

export const loggedMultiDevicesUser = async (loginOrEmail: string, password: string, deviceName: string = 'Default device') => {
    const res = await req.post(`${SETTINGS.PATH.AUTH}/login`)
        .set('User-Agent', deviceName)
        .send({loginOrEmail, password} as TInputLogin)

    const {accessToken} = res.body as TLoginUser;

    const cookies = res.headers['set-cookie'] as unknown as string[];
    const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

    return {accessToken, refreshTokenCookie}
}