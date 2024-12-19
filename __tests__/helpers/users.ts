import {TInputLogin, TInputUser} from "../../src/types/inputModels";
import {SETTINGS} from "../../src/settings";
import {authBasic, req} from "./test-helper";
import {TLoginUser, TUser} from "../../src/types/viewModels";

export const invalidRefreshToken = 'refreshToken=invalidtoken';

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

export const loggedInUser = async (index: number = 1) => {
    const {user, password} = await createdUser(index);

    const res = await req.post(`${SETTINGS.PATH.AUTH}/login`)
        .send({loginOrEmail: user.login, password} as TInputLogin)

    const {accessToken} = res.body as TLoginUser;

    const cookies = res.headers['set-cookie'] as unknown as string[];
    const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

    return {accessToken, refreshTokenCookie, user}
}