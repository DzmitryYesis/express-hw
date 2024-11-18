import {SETTINGS} from '../src/settings';
import {req} from './test-helper';
import {StatusCodeEnum} from '../src/constants';
import {blogForTest, postForTest} from './dataset';
import {TErrorMessage, TInputPost, TBlog, TPost} from '../src/types';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongoClient} from 'mongodb';

const authBasic = Buffer.from(SETTINGS.AUTH_BASIC, 'utf8').toString('base64');

let mongoServer: MongoMemoryServer;
let client: MongoClient;

describe('test CRUD flow for posts', () => {
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
                .get(SETTINGS.PATH.POSTS)
                .expect(StatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body.items.length).toBe(0);
        })

        it('should return error for authorization', async () => {
            await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic bla-bla`)
                .send({...postForTest})
                .expect(StatusCodeEnum.NOT_AUTH_401)
        })

    let blog1: TBlog;
        it('should return error for field title', async () => {
            const resPostBlog = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...blogForTest})
                .expect(StatusCodeEnum.CREATED_201)

            blog1 = resPostBlog.body;

            const res = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...postForTest, title: '', blogId: blog1.id})
                .expect(StatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)
            const errorTypeArray = res.body.errorsMessages.map((item: TErrorMessage) => item.field)
            expect(errorTypeArray.length).toBe(1);
            expect(errorTypeArray[0]).toBe('title')
        })

        it('should return error for field blogId', async () => {
            const res = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...postForTest, blogId: '671d29f1b13de9708bfe729b'})
                .expect(StatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)
            const errorTypeArray = res.body.errorsMessages.map((item: TErrorMessage) => item.field)
            expect(errorTypeArray.length).toBe(1);
            expect(errorTypeArray[0]).toBe('blogId')
        })

        let post1: TPost;
        it('should return created post', async () => {
            const res = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...postForTest, blogId: blog1.id})
                .expect(StatusCodeEnum.CREATED_201)

            post1 = res.body;
            console.log(res.body)

            const resGet = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(StatusCodeEnum.OK_200)

            expect(post1).toEqual({
                id: expect.any(String),
                ...postForTest,
                blogId: blog1.id,
                blogName: blog1.name,
                createdAt: expect.any(String)
            } as TPost);
            expect(resGet.body.items.length).toBe(1);
        })


        let post2: TPost;
        it('should return array with 2 post', async () => {
            const resPost = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...postForTest, blogId: blog1.id})
                .expect(StatusCodeEnum.CREATED_201)

            post2 = resPost.body;

            const res = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(StatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body.items.length).toBe(2);
            expect(res.body.items[1]).toEqual({
                id: expect.any(String),
                ...postForTest,
                blogId: blog1.id,
                blogName: blog1.name,
                createdAt: expect.any(String)
            } as TPost);
        })

        it('shouldn\'t update post with id = post1.id', async () => {
            const data: TInputPost = {
                title: 'Update title',
                shortDescription: 'Update description',
                content: 'Update content',
                blogId: blog1.id
            }

            await req
                .put(`${SETTINGS.PATH.POSTS}/671d29f1b13de9708bfe729b`)
                .set('authorization', `Basic ${authBasic}`)
                .send(data)
                .expect(StatusCodeEnum.NOT_FOUND_404)
        })

        it('should update post with id = post1.id', async () => {
            const data: TInputPost = {
                title: 'Update title',
                shortDescription: 'Update description',
                content: 'Update content',
                blogId: blog1.id
            }

            await req
                .put(`${SETTINGS.PATH.POSTS}/${post1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send(data)
                .expect(StatusCodeEnum.NO_CONTENT_204)

            const res = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(StatusCodeEnum.OK_200)

            const updatePost = res.body.items.find((p: TPost) => p.id === post1.id);
            const notUpdatePost = res.body.items.find((p: TPost) => p.id === post2.id);

            expect(res.body.items.length).toBe(2);
            expect(updatePost).toEqual({
                id: post1.id,
                blogName: post1.blogName,
                createdAt: post1.createdAt,
                ...data
            } as TPost);
            expect(notUpdatePost).toEqual(post2);
        })

        it('shouldn\'t delete post with id = post1.id', async () => {
            await req
                .delete(`${SETTINGS.PATH.POSTS}/671d29f1b13de9708bfe729b`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(StatusCodeEnum.NOT_FOUND_404)
        })

        it('should delete post with id = post1.id', async () => {
            await req
                .delete(`${SETTINGS.PATH.POSTS}/${post1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(StatusCodeEnum.NO_CONTENT_204)

            const res = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(StatusCodeEnum.OK_200)

            const deletedPost = res.body.items.find((p: TPost) => p.id === post1.id);
            const notDeletedPost = res.body.items.find((p: TPost) => p.id === post2.id);

            expect(res.body.items.length).toBe(1);
            expect(deletedPost).toBeUndefined();
            expect(notDeletedPost).toEqual(post2);
        })
    }
)