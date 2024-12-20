import {MongoMemoryServer} from "mongodb-memory-server";
import {MongoClient} from "mongodb";
import {
    createdUser,
    createUserInputBody,
    getStringWithLength,
    invalidCode,
    invalidRefreshToken,
    loggedInUser,
    req
} from "./helpers";
import {SETTINGS} from "../src/settings";
import {HttpStatusCodeEnum} from "../src/constants";
import {TErrorMessage, TLoginUser, TPersonalData} from "../src/types";
import dotenv from "dotenv";

dotenv.config()

jest.mock('nodemailer');
import {mockSendMail} from '../__mocks__';

let mongoServer: MongoMemoryServer;
let client: MongoClient;

//TODO registration-confirmation and registration-email-resending test for expired confirmation code
describe('tests for auth endpoints', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        client = new MongoClient(uri);
        await client.connect();

        await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    afterEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204);
        jest.clearAllMocks();
    })

    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });


    it('should return response with error BAD_REQUEST_400', async () => {
        const {password} = await createdUser(1);

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({loginOrEmail: '', password})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'loginOrEmail',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should send incorrect login return response with error NOT_AUTH_401', async () => {
        const {user, password} = await createdUser(1);

        await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({loginOrEmail: user.login + '1', password})
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('should send incorrect email return response with error NOT_AUTH_401', async () => {
        const {user, password} = await createdUser(1);

        await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({loginOrEmail: user.email + '1', password})
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('should return response with accessToken in body and refreshToken in cookie', async () => {
        const {user, password} = await createdUser(1);

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({loginOrEmail: user.login, password})
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({accessToken: expect.any(String)} as TLoginUser);

        const cookies = res.headers['set-cookie'] as unknown as string[];
        expect(cookies).toBeDefined();

        const hasRefreshToken = cookies.some(cookie => cookie.startsWith('refreshToken='));
        expect(hasRefreshToken).toBe(true);
    })

    it('should return work normal after 5 login request one by one', async () => {
        const {user, password} = await createdUser(1);

        for (let i = 1; i < 6; i++) {
            await req
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send({loginOrEmail: user.login, password})
                .expect(HttpStatusCodeEnum.OK_200)
        }
    })

    it('should return error TY_MANY_REQUEST after 6 login one by one', async () => {
        const {user, password} = await createdUser(1);

        for (let i = 1; i < 6; i++) {
            await req
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send({loginOrEmail: user.login, password})
                .expect(HttpStatusCodeEnum.OK_200)
        }

        await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({loginOrEmail: user.login, password})
            .expect(HttpStatusCodeEnum.TO_MANY_REQUESTS)
    })

    it('should return response with NOT_AUTH_401 error', async () => {
        await loggedInUser(1);

        await req
            .get(`${SETTINGS.PATH.AUTH}/me`)
            .set('authorization', `Bearer bla-bla`)
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('should return response with info about user', async () => {
        const {user, accessToken} = await loggedInUser(1);

        const res = await req
            .get(`${SETTINGS.PATH.AUTH}/me`)
            .set('authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodeEnum.OK_200)

        expect(res.body).toStrictEqual({
            login: user.login,
            email: user.email,
            userId: user.id
        } as TPersonalData)
    })

    it('should return response NOT_AUTH_401 error', async () => {
        await loggedInUser(1);

        await req
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', invalidRefreshToken)
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    //TODO problem with iat for refresh token
    /*it('should return response new accessToken and refreshToken', async () => {
        const {accessToken, refreshTokenCookie} = await loggedInUser(1);

        console.log(refreshTokenCookie)
        const {iat: iatAccessToken} = await jwtService.decodeAccessToken(accessToken);
        const {iat: iatRefreshToken} = await jwtService.decodeRefreshToken(refreshTokenCookie!.replace('refreshToken=', ''));

        await sleep(3000);

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', refreshTokenCookie!)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({accessToken: expect.any(String)} as TLoginUser);

        const cookies = res.headers['set-cookie'] as unknown as string[];
        const newRefreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

        const {iat: newIatAccessToken} = await jwtService.decodeAccessToken(res.body.accessToken);
        const {iat: newIatRefreshToken} = await jwtService.decodeRefreshToken(newRefreshTokenCookie!.replace('refreshToken=', ''));

        expect(newRefreshTokenCookie).toStrictEqual(expect.any(String));
        expect(newIatAccessToken).not.toEqual(iatAccessToken);
        expect(newIatRefreshToken).not.toEqual(iatRefreshToken);
    })*/

    it('should return response NOT_AUTH_401 error', async () => {
        await loggedInUser(1);

        await req
            .post(`${SETTINGS.PATH.AUTH}/logout`)
            .set('Cookie', invalidRefreshToken)
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('should return response NO_CONTENT_204 and without refreshToken', async () => {
        const {refreshTokenCookie} = await loggedInUser(1);

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/logout`)
            .set('Cookie', refreshTokenCookie!)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const cookie = res.headers['set-cookie'] as unknown as string[] || []
        const clearedCookie = cookie.find((cookie) => cookie.startsWith('refreshToken='));
        expect(clearedCookie).toBeUndefined();
    })

    it('should return response with status BAD_REQUEST_400 and validation errors for fields login, password, email', async () => {
        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send({login: getStringWithLength(2), password: '', email: getStringWithLength(16)})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(3);

        res.body.errorsMessages.forEach((error: TErrorMessage) => {
            expect(error).toHaveProperty('field');
            expect(error).toHaveProperty('message');
            expect(typeof error.field).toBe('string');
            expect(typeof error.message).toBe('string');
        });

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'login',
                    message: expect.any(String),
                }),
                expect.objectContaining({
                    field: 'password',
                    message: expect.any(String),
                }),
                expect.objectContaining({
                    field: 'email',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should return response with status BAD_REQUEST_400 and validation errors for fields password, email', async () => {
        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send({login: getStringWithLength(4), password: getStringWithLength(2), email: getStringWithLength(16)})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(2);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'password',
                    message: expect.any(String),
                }),
                expect.objectContaining({
                    field: 'email',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should return response with status BAD_REQUEST_400 and not unique error for fields login, but email also not unique', async () => {
        const {user: user1} = await createdUser(1);
        const user2 = createUserInputBody(2);

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send({...user2, login: user1.login, email: user1.email})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'login',
                    message: 'not unique',
                }),
            ])
        );
    })

    it('should return response with status BAD_REQUEST_400 and not unique error for fields email', async () => {
        const {user: user1} = await createdUser(1);
        const user2 = createUserInputBody(2);

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send({...user2, email: user1.email})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'not unique',
                }),
            ])
        );
    })

    it('should return response with status NO_CONTENT_204', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    it('should return work normal after 5 registration request one by one', async () => {
        for (let i = 1; i < 6; i++) {
            const user = createUserInputBody(i)

            await req
                .post(`${SETTINGS.PATH.AUTH}/registration`)
                .send(user)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)
        }
    })

    it('should return error TY_MANY_REQUEST after 6 registration one by one', async () => {
        const user = createUserInputBody(6)

        for (let i = 1; i < 6; i++) {
            const userI = createUserInputBody(i)
            await req
                .post(`${SETTINGS.PATH.AUTH}/registration`)
                .send(userI)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)
        }

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.TO_MANY_REQUESTS)
    })

    it('should return response with status BAD_REQUEST_400 for invalid code', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        expect(mockSendMail).toHaveBeenCalledTimes(1);

        const sentMailContent = mockSendMail.mock.calls[0][0].html;
        const confirmationCode = sentMailContent.match(/code=([\w-]+)/)?.[1];

        expect(confirmationCode).toBeDefined();

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: invalidCode})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'code',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should confirmed user email', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        expect(mockSendMail).toHaveBeenCalledTimes(1);

        const sentMailContent = mockSendMail.mock.calls[0][0].html;
        const confirmationCode = sentMailContent.match(/code=([\w-]+)/)?.[1];

        expect(confirmationCode).toBeDefined();

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: confirmationCode})
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    it('should return response with status BAD_REQUEST_400 when user already confirmed', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        expect(mockSendMail).toHaveBeenCalledTimes(1);

        const sentMailContent = mockSendMail.mock.calls[0][0].html;
        const confirmationCode = sentMailContent.match(/code=([\w-]+)/)?.[1];

        expect(confirmationCode).toBeDefined();

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: confirmationCode})
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: confirmationCode})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'code',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should return response with error TO_MANY_REQUESTS', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        expect(mockSendMail).toHaveBeenCalledTimes(1);

        const sentMailContent = mockSendMail.mock.calls[0][0].html;
        const confirmationCode = sentMailContent.match(/code=([\w-]+)/)?.[1];

        expect(confirmationCode).toBeDefined();

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: confirmationCode})
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        for (let i = 1; i < 5; i++) {
            await req
                .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
                .send({code: confirmationCode})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)
        }

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: confirmationCode})
            .expect(HttpStatusCodeEnum.TO_MANY_REQUESTS)
    })

    it('should return response with status BAD_REQUEST_400 for resend email when user already confirmed', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        expect(mockSendMail).toHaveBeenCalledTimes(1);

        const sentMailContent = mockSendMail.mock.calls[0][0].html;
        const confirmationCode = sentMailContent.match(/code=([\w-]+)/)?.[1];

        expect(confirmationCode).toBeDefined();

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: confirmationCode})
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
            .send({email: user.email})
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should return response with status TY_MANY_REQUEST', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        expect(mockSendMail).toHaveBeenCalledTimes(1);

        const sentMailContent = mockSendMail.mock.calls[0][0].html;
        const confirmationCode = sentMailContent.match(/code=([\w-]+)/)?.[1];

        expect(confirmationCode).toBeDefined();

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
            .send({code: confirmationCode})
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        for (let i = 1; i < 6; i++) {
            await req
                .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
                .send({email: user.email})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)
        }

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
            .send({email: user.email})
            .expect(HttpStatusCodeEnum.TO_MANY_REQUESTS)
    })
})