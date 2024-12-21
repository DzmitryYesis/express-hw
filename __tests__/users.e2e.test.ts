import {SETTINGS} from "../src/settings";
import {
    authBasic,
    createdUser,
    createdUsers,
    createUserInputBody,
    getStringWithLength,
    invalidBlogId,
    req, testDbName
} from "./helpers";
import {HttpStatusCodeEnum} from "../src/constants";
import {TErrorMessage, TUser} from "../src/types";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

describe('test CRUD flow for users', () => {
    const mongoURI = process.env.MONGO_URL || SETTINGS.MONGO_URL

    beforeAll(async () => {
        await mongoose.connect(`${mongoURI}/${testDbName}`)

        await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    afterEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    });

    it('should return error NOT_AUTH_401', async () => {
        await req
            .get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic bla-bla`)
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('should return response with default queries data and empty Array for items users', async () => {
        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });
    })

    it('should return error NOT_AUTH_401', async () => {
        await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic bla-bla`)
            .send(createUserInputBody(1))
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('should return response with status BAD_REQUEST_400 and validation errors for fields login, password, email', async () => {
        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
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

    it('should return response with status BAD_REQUEST_400 and validation errors for fields email', async () => {
        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
            .send({...createUserInputBody(1), email: 'email.com'})
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

    it('should return response with status BAD_REQUEST_400 and not unique error for fields login, but email also not unique', async () => {
        const {user: user1} = await createdUser(1);
        const user2 = createUserInputBody(2);

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
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
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
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

    it('should created and return user', async () => {
        const user = createUserInputBody(1);

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
            .send(user)
            .expect(HttpStatusCodeEnum.CREATED_201)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            id: expect.any(String),
            createdAt: expect.any(String),
            login: user.login,
            email: user.email
        } as TUser);
    })

    it('shouldn\'t delete user without auth', async () => {
        const {user} = await createdUser(1);

        await req
            .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
            .set('authorization', `Basic bla-bla`)
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('shouldn\'t delete user by invalid userId', async () => {
        await createdUser(1);

        await req
            .delete(`${SETTINGS.PATH.USERS}/${invalidBlogId}`)
            .set('authorization', `Basic ${authBasic}`)
            .expect(HttpStatusCodeEnum.NOT_FOUND_404)
    })

    it('delete user by userId', async () => {
        const {user} = await createdUser(1);

        await req
            .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
            .set('authorization', `Basic ${authBasic}`)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    it('should response with default queries data and 1 user', async () => {
        const {user} = await createdUser(1);

        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [user]
        });
    })

    it('should response with default queries data and 5 user', async () => {
        const users = await createdUsers(5);

        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${authBasic}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 5,
            items: users
        });
    })

    it('should response with queries pageSize=4 pageNumber=2', async () => {
        const users = await createdUsers(20);

        const res = await req
            .get(`${SETTINGS.PATH.USERS}?pageSize=4&pageNumber=2`)
            .set('authorization', `Basic ${authBasic}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            pagesCount: 5,
            page: 2,
            pageSize: 4,
            totalCount: 20,
            items: users.slice(4, 8)
        });
        expect(res.body.items.length).toBe(4);
    })

    it('should response with queries searchLoginTerm=2 searchEmailTerm=4 and 3 users', async () => {
        const users = await createdUsers(12);

        const res = await req
            .get(`${SETTINGS.PATH.USERS}?searchLoginTerm=2&searchEmailTerm=4`)
            .set('authorization', `Basic ${authBasic}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 3,
            items: users.filter(u => u.login.includes('2') || u.email.includes('4'))
        });
        expect(res.body.items.length).toBe(3);
    })
})