import {req} from './test-helper';
import {SETTINGS} from '../src/settings';
import {StatusCodeEnum} from '../src/constants';
import {blogForTest} from './dataset';
import {TBlog} from '../src/db';
import {TErrorMessage, TInputBlog} from '../src/features/blogs/types';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongoClient} from 'mongodb';

const authBasic = Buffer.from(SETTINGS.AUTH_BASIC, 'utf8').toString('base64');

let mongoServer: MongoMemoryServer;
let client: MongoClient;

describe('test CRUD flow for blogs', () => {
        beforeAll(async () => {
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();

            client = new MongoClient(uri);
            await client.connect();

            await req.delete(SETTINGS.PATH.TESTING).expect(StatusCodeEnum.NO_CONTENT_204)
        })

    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });

        it('should return empty array', async () => {
            const res = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(StatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body.length).toBe(0);
        })

        it('should return error for authorization', async () => {
            await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic bla-bla`)
                .send({...blogForTest})
                .expect(StatusCodeEnum.NOT_AUTH_401)
        })

        it('should return error for field name', async () => {
            const res = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...blogForTest, name: ''})
                .expect(StatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)
            const errorTypeArray = res.body.errorsMessages.map((item: TErrorMessage) => item.field)
            expect(errorTypeArray.length).toBe(1);
            expect(errorTypeArray[0]).toBe('name')
        })

        it('should return error for field websiteUrl', async () => {
            const res = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...blogForTest, websiteUrl: 'blabla.com1'})
                .expect(StatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)
            const errorTypeArray = res.body.errorsMessages.map((item: TErrorMessage) => item.field)
            expect(errorTypeArray.length).toBe(1);
            expect(errorTypeArray[0]).toBe('websiteUrl')
        })

        let blog1: TBlog;
        it('should return created blog', async () => {
            const res = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...blogForTest})
                .expect(StatusCodeEnum.CREATED_201)

            blog1 = res.body;
            console.log(res.body)

            const resGet = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(StatusCodeEnum.OK_200)

            expect(blog1).toEqual({
                id: expect.any(String),
                isMembership: expect.any(Boolean),
                createdAt: expect.any(String),
                ...blogForTest
            } as TBlog);
            expect(resGet.body.length).toBe(1);
        })

        let blog2: TBlog;
        it('should return array with 2 blogs', async () => {
            const resPost = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...blogForTest})
                .expect(StatusCodeEnum.CREATED_201)

            blog2 = resPost.body;

            const res = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(StatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body.length).toBe(2);
            expect(res.body[1]).toEqual(blog2);
        })

        it('shouldn\'t update blog with id = blog1.id', async () => {
            const data: TInputBlog = {
                name: 'Update name',
                description: 'Update description',
                websiteUrl: 'https://update-bla-bla.com1'
            }

            await req
                .put(`${SETTINGS.PATH.BLOGS}/671d29f1b13de9708bfe729b`)
                .set('authorization', `Basic ${authBasic}`)
                .send(data)
                .expect(StatusCodeEnum.NOT_FOUND_404)
        })

        it('should update blog with id = blog1.id', async () => {
            const data: TInputBlog = {
                name: 'Update name',
                description: 'Update description',
                websiteUrl: 'https://update-bla-bla.com1'
            }

            await req
                .put(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send(data)
                .expect(StatusCodeEnum.NO_CONTENT_204)

            const res = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(StatusCodeEnum.OK_200)

            const updateBlog = res.body.find((b: TBlog) => b.id === blog1.id);
            const notUpdateBlog = res.body.find((b: TBlog) => b.id === blog2.id);

            expect(res.body.length).toBe(2);
            expect(updateBlog).toEqual({
                id: blog1.id,
                createdAt: blog1.createdAt,
                isMembership: blog1.isMembership,
                ...data
            } as TBlog );
            expect(notUpdateBlog).toEqual(blog2);
        })

        it('shouldn\'t delete blog with id = blog1.id', async () => {
            await req
                .delete(`${SETTINGS.PATH.BLOGS}/671d29f1b13de9708bfe729b`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(StatusCodeEnum.NOT_FOUND_404)
        })

        it('should delete blog with id = blog1.id', async () => {
            await req
                .delete(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(StatusCodeEnum.NO_CONTENT_204)

            const res = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(StatusCodeEnum.OK_200)

            const deletedBlog = res.body.find((b: TBlog) => b.id === blog1.id);
            const notDeletedBlog = res.body.find((b: TBlog) => b.id === blog2.id);

            expect(res.body.length).toBe(1);
            expect(deletedBlog).toBeUndefined();
            expect(notDeletedBlog).toEqual(blog2);
        })
    }
)