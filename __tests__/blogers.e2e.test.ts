import {
    authBasic,
    createBlogInputBody,
    getStringWithLength,
    invalidBlogId,
    createdBlog,
    createdBlogs,
    req, createPostForBlogByIdInputBody, createdPostForBlogByBlogId, createdPostsForBlogByBlogId
} from './helpers';
import {SETTINGS} from '../src/settings';
import {HttpStatusCodeEnum} from '../src/constants';
import {TErrorMessage, TBlog, TPost} from '../src/types';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongoClient} from 'mongodb';
import 'jest-extended';

let mongoServer: MongoMemoryServer;
let client: MongoClient;

describe('test CRUD flow for blogs', () => {
        beforeAll(async () => {
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();

            client = new MongoClient(uri);
            await client.connect();

            await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
        })

        afterEach(async () => {
            await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
        })

        afterAll(async () => {
            await client.close();
            await mongoServer.stop();
        });

        it('should return response with default queries data and empty Array for items', async () => {
            const res = await req
                .get(SETTINGS.PATH.BLOGS)
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
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic bla-bla`)
                .send(createBlogInputBody(1))
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('should return response with status BAD_REQUEST_400 and error for fields name, description, websiteUrl', async () => {
            const res = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...createBlogInputBody(1), name: getStringWithLength(16), description: '', websiteUrl: ''})
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
                        field: 'name',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'description',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'websiteUrl',
                        message: expect.any(String),
                    }),
                ])
            );
        })

        it('should return response with status BAD_REQUEST_400 and error for fields websiteUrl', async () => {
            const res = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...createBlogInputBody(1), websiteUrl: 'sgh'})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(1);

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'websiteUrl',
                        message: expect.any(String),
                    }),
                ])
            );
        })


        it('should created and return blog', async () => {
            const blog1 = createBlogInputBody(1);

            const res = await req
                .post(SETTINGS.PATH.BLOGS)
                .set('authorization', `Basic ${authBasic}`)
                .send(blog1)
                .expect(HttpStatusCodeEnum.CREATED_201)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                id: expect.any(String),
                isMembership: expect.any(Boolean),
                createdAt: expect.any(String),
                ...blog1
            } as TBlog);
        })


        it('should response with default queries data and 1 blog', async () => {
            const blog1 = await createdBlog(1);

            const res = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [blog1]
            });
        })

        it('should response with default queries data and 3 blogs', async () => {
            const blog1 = await createdBlog(1);
            const blog2 = await createdBlog(2);
            const blog3 = await createdBlog(3);

            const res = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: [blog3, blog2, blog1]
            });
        })

        it('should response with default queries and 10 blogs', async () => {
            const blogsArray = await createdBlogs(15);

            const res = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 2,
                page: 1,
                pageSize: 10,
                totalCount: 15,
                items: blogsArray.slice(0, 10)
            });
            expect(res.body.items.length).toBe(10);
        })

        it('should response with queries pageSize=20 and 15 blogs', async () => {
            const blogsArray = await createdBlogs(15);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}?pageSize=20`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 20,
                totalCount: 15,
                items: blogsArray
            });
            expect(res.body.items.length).toBe(15);
        })

        it('should response with queries pageSize=20 sortDirection=asc and 15 blogs', async () => {
            const blogsArray = await createdBlogs(15);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}?pageSize=20&sortDirection=asc`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 20,
                totalCount: 15,
                items: blogsArray.reverse()
            });
            expect(res.body.items.length).toBe(15);
        })

        it('should response with queries pageSize=3 pageNumber=4 sortDirection=asc and 3 blogs', async () => {
            const blogsArray = await createdBlogs(15);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}?pageSize=3&pageNumber=4&sortDirection=asc`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 5,
                page: 4,
                pageSize: 3,
                totalCount: 15,
                items: blogsArray.reverse().slice(9, 12)
            });
            expect(res.body.items.length).toBe(3);
        })

        it('should response with queries sortDirection=asc searchNameTerm=2 and 2 blogs', async () => {
            const blogsArray = await createdBlogs(15);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}?sortDirection=asc&searchNameTerm=2`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: blogsArray.reverse().filter(blog => blog.name.includes('2'))
            });
            expect(res.body.items.length).toBe(2);
        })

        it('should response with queries sortBy=name and 10 blogs', async () => {
            const blogsArray = await createdBlogs(15);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}?sortBy=name`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 2,
                page: 1,
                pageSize: 10,
                totalCount: 15,
                items: blogsArray.sort((a: TBlog, b: TBlog) => b.name.localeCompare(a.name)).slice(0, 10)
            });
        })

        it('shouldn\'t get blog by invalid blogId', async () => {
            await createdBlog(1);

            await req
                .get(`${SETTINGS.PATH.BLOGS}/${invalidBlogId}`)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('return blog by blogId', async () => {
            const blog1 = await createdBlog(1);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual(blog1)
        })

        it('shouldn\'t delete blog without auth', async () => {
            await req
                .delete(`${SETTINGS.PATH.BLOGS}/${invalidBlogId}`)
                .set('authorization', `Basic bla-bla`)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('shouldn\'t delete blog by invalid blogId', async () => {
            await createdBlog(1);

            await req
                .delete(`${SETTINGS.PATH.BLOGS}/${invalidBlogId}`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('delete blog by blogId', async () => {
            const blog1 = await createdBlog(1);

            await req
                .delete(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)
        })

        it('shouldn\'t update blog without auth', async () => {
            const blog1 = await createdBlog(1);
            const blog2 = createBlogInputBody(2);

            await req
                .put(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .set('authorization', `Basic bla-bla`)
                .send(blog2)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('shouldn\'t update blog with invalid blogId', async () => {
            const blog2 = createBlogInputBody(2);

            await req
                .put(`${SETTINGS.PATH.BLOGS}/${invalidBlogId}`)
                .set('authorization', `Basic ${authBasic}`)
                .send(blog2)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should return response with status BAD_REQUEST_400 and error for fields name, websiteUrl', async () => {
            const blog1 = await createdBlog(1);
            const blog2 = createBlogInputBody(2);

            const res = await req
                .put(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send({...blog2, name: '', websiteUrl: ''})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(2);

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'name',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'websiteUrl',
                        message: expect.any(String),
                    }),
                ])
            );
        })

        it('should return response with status BAD_REQUEST_400 and error for fields name', async () => {
            const blog1 = await createdBlog(1);
            const blog2 = createBlogInputBody(2);

            const res = await req
                .put(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send({...blog2, name: getStringWithLength(16)})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(1);

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'name',
                        message: expect.any(String),
                    }),
                ])
            );
        })

        it('should update blog', async () => {
            const blog1 = await createdBlog(1);
            const blog2 = createBlogInputBody(2);

            await req
                .put(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send(blog2)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}/${blog1.id}`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({...blog1, ...blog2})
        })

        it('shouldn\'t create post for blog without auth', async () => {
            const blog1 = await createdBlog(1);
            const post1 = createPostForBlogByIdInputBody(1);

            await req
                .post(`${SETTINGS.PATH.BLOGS}/${blog1.id}/posts`)
                .set('authorization', `Basic bla-bla`)
                .send(post1)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('shouldn\'t create post for blog with invalid blogId', async () => {
            await createdBlog(1);
            const post1 = createPostForBlogByIdInputBody(1);

            await req
                .post(`${SETTINGS.PATH.BLOGS}/${invalidBlogId}/posts`)
                .set('authorization', `Basic ${authBasic}`)
                .send(post1)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should return response BAD_REQUEST_400 with fields title, content, shortDescription', async () => {
            const blob1 = await createdBlog(1);

            const res = await req
                .post(`${SETTINGS.PATH.BLOGS}/${blob1.id}/posts`)
                .set('authorization', `Basic ${authBasic}`)
                .send({title: '', content: '', shortDescription: ''})
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
                        field: 'title',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'content',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'shortDescription',
                        message: expect.any(String),
                    }),
                ])
            );
        })

        it('should return response BAD_REQUEST_400 with fields content', async () => {
            const blob1 = await createdBlog(1);
            const post1 = createPostForBlogByIdInputBody(1);

            const res = await req
                .post(`${SETTINGS.PATH.BLOGS}/${blob1.id}/posts`)
                .set('authorization', `Basic ${authBasic}`)
                .send({...post1, content: getStringWithLength(1001),})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(1);

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'content',
                        message: expect.any(String),
                    })
                ])
            );
        })

        it('should create post for blog by blogId', async () => {
            const blob1 = await createdBlog(1);
            const post1 = createPostForBlogByIdInputBody(1);

            const res = await req
                .post(`${SETTINGS.PATH.BLOGS}/${blob1.id}/posts`)
                .set('authorization', `Basic ${authBasic}`)
                .send(post1)
                .expect(HttpStatusCodeEnum.CREATED_201)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                id: expect.any(String),
                createdAt: expect.any(String),
                blogId: blob1.id,
                blogName: blob1.name,
                ...post1
            } as TPost);
        })

        it('should return response with NOT_FOUND_404 for invalid blogId', async () => {
            await createdBlog(1);

            await req
                .get(`${SETTINGS.PATH.BLOGS}/${invalidBlogId}/posts`)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should response with default queries data and 1 post for blog', async () => {
            const blog1 = await createdBlog(1);
            const post1 = await createdPostForBlogByBlogId(1, blog1.id);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}/${blog1.id}/posts`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [post1]
            });
            expect(res.body.items.length).toBe(1);
        })

        it('should response with default queries data and 10 post for blog', async () => {
            const blog1 = await createdBlog(1);
            const posts = await createdPostsForBlogByBlogId(17, blog1.id);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}/${blog1.id}/posts`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 2,
                page: 1,
                pageSize: 10,
                totalCount: 17,
                items: posts.slice(0, 10)
            });
            expect(res.body.items.length).toBe(10);
        })

        it('should response with queries data pageSize=30, sortBy=title and 17 post for blog', async () => {
            const blog1 = await createdBlog(1);
            const posts = await createdPostsForBlogByBlogId(17, blog1.id);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}/${blog1.id}/posts?pageSize=30&sortBy=title`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 30,
                totalCount: 17,
                items: posts.sort((a: TPost, b: TPost) => b.title.localeCompare(a.title))
            });
            expect(res.body.items.length).toBe(17);
        })

        it('should response with queries data pageSize=5, pageNumber=3, sortDirection=asc and 5 post for blog', async () => {
            const blog1 = await createdBlog(1);
            const posts = await createdPostsForBlogByBlogId(17, blog1.id);

            const res = await req
                .get(`${SETTINGS.PATH.BLOGS}/${blog1.id}/posts?pageSize=5&pageNumber=3&sortDirection=asc`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 4,
                page: 3,
                pageSize: 5,
                totalCount: 17,
                items: posts.reverse().slice(10, 15)
            });
            expect(res.body.items.length).toBe(5);
        })
    }
)