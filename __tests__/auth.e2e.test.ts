import {MongoMemoryServer} from "mongodb-memory-server";
import {MongoClient} from "mongodb";
import {
    createdUser,
    createUserInputBody,
    getStringWithLength,
    invalidRefreshToken,
    loggedInUser,
    req
} from "./helpers";
import {SETTINGS} from "../src/settings";
import {HttpStatusCodeEnum} from "../src/constants";
import {TErrorMessage, TLoginUser, TPersonalData} from "../src/types";
import dotenv from "dotenv";

dotenv.config()

let mongoServer: MongoMemoryServer;
let client: MongoClient;

describe('tests for auth endpoints', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        client = new MongoClient(uri);
        await client.connect();

        /*process.env.MONGO_URL = uri;
        client = new MongoClient(uri);*/

        await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    afterEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });

    //TODO registration-confirmation and registration-email-resending
    /*it('should return response with status BAD_REQUEST_400', async () => {
        const user = createUserInputBody(1)

        await req
            .post(`${SETTINGS.PATH.AUTH}/registration`)
            .send(user)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)


        const db = client.db();
        const usersCollectionTest = db.collection<TUserDB>(SETTINGS.DB_COLLECTION_USERS_NAME);

        const userDB = await usersCollectionTest.findOne({email: user.email})

        console.log(userDB)
    })*/

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

    it('should return response new accessToken and refreshToken', async () => {
        const {refreshTokenCookie} = await loggedInUser(1);

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', refreshTokenCookie!)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({accessToken: expect.any(String)} as TLoginUser);
        //TODO fix problem with equality
        /*expect(res.body.accessToken).not.toEqual(accessToken);*/
        /*const {iat: iatAccessToken} = await jwtService.decodeAccessToken(accessToken);
        const {iat: newIatAccessToken} = await jwtService.decodeAccessToken(res.body.accessToken);

        console.log('newIatAccessToken', newIatAccessToken)
        console.log('iatAccessToken', iatAccessToken)

        expect(newIatAccessToken).not.toEqual(iatAccessToken);

        console.log('newIatAccessToken', newIatAccessToken)
        console.log('iatAccessToken', iatAccessToken)*/

        const cookies = res.headers['set-cookie'] as unknown as string[];
        const newRefreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

        expect(newRefreshTokenCookie).toStrictEqual(expect.any(String));
        //TODO fix problem with equality
        /*expect(newRefreshTokenCookie).not.toEqual(refreshTokenCookie!);*/

        /*const {iat: iatRefreshToken} = await jwtService.decodeRefreshToken(refreshTokenCookie!);
        const {iat: newIatRefreshToken} = await jwtService.decodeRefreshToken(newRefreshTokenCookie!.replace('refreshToken=', ''));
        expect(newIatRefreshToken).not.toEqual(iatRefreshToken);*/
    })

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


})