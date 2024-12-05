import {SETTINGS} from '../src/settings';
import {
    createdBlog,
    createdCommentInputBody,
    createdCommentsForPostByPostId,
    createdPost,
    createdPostInputBody,
    createdPosts,
    getStringWithLength,
    invalidBlogId,
    invalidPostId,
    loggedInUser,
    req
} from './helpers';
import {HttpStatusCodeEnum} from '../src/constants';
import {TComment, TErrorMessage, TInputComment, TInputPost, TPost} from '../src/types';
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
                .get(SETTINGS.PATH.POSTS)
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
            const blog1 = await createdBlog(1);

            await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic bla-bla`)
                .send(createdPostInputBody(1, blog1.id))
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })


        it('should return response with status BAD_REQUEST_400 and error for fields title, content, shortDescription, blogId', async () => {
            const res = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send({
                    title: getStringWithLength(31),
                    shortDescription: getStringWithLength(101),
                    content: getStringWithLength(1001),
                    blogId: invalidBlogId
                } as TInputPost)
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(4);

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
                        field: 'shortDescription',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'content',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'blogId',
                        message: expect.any(String),
                    })
                ])
            );
        })

        it('should return response with status BAD_REQUEST_400 and error for fields title, blogId', async () => {
            const res = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send({
                    title: getStringWithLength(31),
                    shortDescription: getStringWithLength(80),
                    content: getStringWithLength(350),
                    blogId: invalidBlogId
                } as TInputPost)
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(2);

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'title',
                        message: expect.any(String),
                    }),
                    expect.objectContaining({
                        field: 'blogId',
                        message: expect.any(String),
                    })
                ])
            );
        })

        it('should return response with status BAD_REQUEST_400 and error for fields title', async () => {
            const blog1 = await createdBlog(1);

            const res = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send({...createdPostInputBody(1, blog1.id), title: ''})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(1);

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'title',
                        message: expect.any(String),
                    })
                ])
            );
        })

        it('should created and return post', async () => {
            const blog1 = await createdBlog(1);
            const post = createdPostInputBody(1, blog1.id)

            const res = await req
                .post(SETTINGS.PATH.POSTS)
                .set('authorization', `Basic ${authBasic}`)
                .send(post)
                .expect(HttpStatusCodeEnum.CREATED_201)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                id: expect.any(String),
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogId: blog1.id,
                blogName: blog1.name,
                createdAt: expect.any(String)
            } as TPost);
        })

        it('should response with default queries data and 1 post', async () => {
            const {post} = await createdPost(1);

            const res = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [post]
            });
        })

        it('should response with default queries data and 3 posts', async () => {
            const {postsArray} = await createdPosts(3);

            const res = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: postsArray
            });
        })

        it('should response with default queries data and 10 posts', async () => {
            const {postsArray} = await createdPosts(15);

            const res = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 2,
                page: 1,
                pageSize: 10,
                totalCount: 15,
                items: postsArray.slice(0, 10),
            });
            expect(res.body.items.length).toBe(10);
        })

        it('should response with queries pageSize=30 data and 20 posts', async () => {
            const {postsArray} = await createdPosts(20);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}?pageSize=30`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 30,
                totalCount: 20,
                items: postsArray,
            });
            expect(res.body.items.length).toBe(20);
        })

        it('should response with queries pageSize=30 sortDirection=asc data and 20 posts', async () => {
            const {postsArray} = await createdPosts(20);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}?pageSize=30&sortDirection=asc`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 30,
                totalCount: 20,
                items: postsArray.reverse(),
            });
            expect(res.body.items.length).toBe(20);
        })

        it('should response with queries pageSize=8 pageNumber=7 sortDirection=asc', async () => {
            const {postsArray} = await createdPosts(80);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}?pageSize=8&pageNumber=7&sortDirection=asc`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 10,
                page: 7,
                pageSize: 8,
                totalCount: 80,
                items: postsArray.reverse().slice(48, 56)
            });
            expect(res.body.items.length).toBe(8);
        })

        it('should response with queries pageSize=20 sortBy=blogName', async () => {
            const {postsArray: postsForBlog1} = await createdPosts(5);
            const {postsArray: postsForBlog2} = await createdPosts(5, 2);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}?pageSize=20&sortBy=blogName`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 20,
                totalCount: 10,
                items: [...postsForBlog2.reverse(), ...postsForBlog1.reverse()]
            });
            expect(res.body.items.length).toBe(10);
        })

        it('should response with queries pageSize=20 sortBy=blogName sortDirection=asc', async () => {
            const {postsArray: postsForBlog1} = await createdPosts(5);
            const {postsArray: postsForBlog2} = await createdPosts(5, 2);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}?pageSize=20&sortBy=blogName&sortDirection=asc`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 20,
                totalCount: 10,
                items: [...postsForBlog1.reverse(), ...postsForBlog2.reverse()]
            });
            expect(res.body.items.length).toBe(10);
        })

        it('shouldn\'t get post by invalid postId', async () => {
            await createdPost(1);

            await req
                .get(`${SETTINGS.PATH.POSTS}/${invalidPostId}`)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should return post by postId', async () => {
            const {post, blog} = await createdPost(1);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual(post)
            expect(res.body.blogId).toBe(blog.id)
        })

        it('shouldn\'t delete post without auth', async () => {
            const {post} = await createdPost(1);

            await req
                .delete(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .set('authorization', `Basic bla-bla`)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('shouldn\'t delete post by invalid postId', async () => {
            await createdPost(1);

            await req
                .delete(`${SETTINGS.PATH.POSTS}/${invalidPostId}`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('delete post by postId', async () => {
            const {post} = await createdPost(1);

            await req
                .delete(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)
        })

        it('shouldn\'t update post without auth', async () => {
            const {post, blog} = await createdPost(1);
            const post2 = createdPostInputBody(2, blog.id);

            await req
                .put(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .set('authorization', `Basic bla-bla`)
                .send(post2)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('shouldn\'t update post with invalid postId', async () => {
            const {blog} = await createdPost(1);
            const post2 = createdPostInputBody(2, blog.id);

            await req
                .put(`${SETTINGS.PATH.POSTS}/${invalidPostId}`)
                .set('authorization', `Basic ${authBasic}`)
                .send(post2)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should return response with status BAD_REQUEST_400 and error for fields title, content', async () => {
            const {post, blog} = await createdPost(1);
            const post2 = createdPostInputBody(2, blog.id);

            const res = await req
                .put(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send({...post2, title: '', content: ''})
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(2);

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
                ])
            );
        })

        it('should return response with status BAD_REQUEST_400 and error for fields blogId', async () => {
            const {post} = await createdPost(1);
            const post2 = createdPostInputBody(2, invalidBlogId);

            const res = await req
                .put(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send(post2)
                .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

            console.log(res.body)

            expect(res.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(res.body.errorsMessages)).toBe(true);
            expect(res.body.errorsMessages).toHaveLength(1);

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'blogId',
                        message: expect.any(String),
                    })
                ])
            );
        })

        it('should update post', async () => {
            const {post, blog} = await createdPost(1);
            const post2 = createdPostInputBody(2, blog.id);

            await req
                .put(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .set('authorization', `Basic ${authBasic}`)
                .send(post2)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({...post, ...post2})
        })

        it('should return response with error NOT_AUTH_401', async () => {
            const {post} = await createdPost(1);
            const comment = createdCommentInputBody(1);

            await req
                .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .set('authorization', `Basic bla-bla-bla`)
                .send(comment)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('should return response with error BAD_REQUEST_400 for small content length', async () => {
            const {post} = await createdPost(1);
            const {accessToken} = await loggedInUser();

            const res = await req
                .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .set('authorization', `Bearer ${accessToken}`)
                .send({content: getStringWithLength(15)} as TInputComment)
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
                    }),
                ])
            );
        })

        it('should return response with error BAD_REQUEST_400 for big content length', async () => {
            const {post} = await createdPost(1);
            const {accessToken} = await loggedInUser();

            const res = await req
                .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .set('authorization', `Bearer ${accessToken}`)
                .send({content: getStringWithLength(350)} as TInputComment)
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
                    }),
                ])
            );
        })

        it('should return response with error NOT_FOUND_404 for invalid postId', async () => {
            await createdPost(1);
            const {accessToken} = await loggedInUser();
            const comment = createdCommentInputBody(1);

            await req
                .post(`${SETTINGS.PATH.POSTS}/${invalidPostId}/comments`)
                .set('authorization', `Bearer ${accessToken}`)
                .send(comment)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should created and return comment', async () => {
            const {post} = await createdPost(1);
            const {accessToken, user} = await loggedInUser();
            const comment = createdCommentInputBody(1);

            const res = await req
                .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .set('authorization', `Bearer ${accessToken}`)
                .send(comment)
                .expect(HttpStatusCodeEnum.CREATED_201)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                id: expect.any(String),
                createdAt: expect.any(String),
                content: comment.content,
                commentatorInfo: {
                    userId: user.id,
                    userLogin: user.login
                }
            } as TComment);
        })

        it('should response with error NOT_FOUND_404', async () => {
            await createdPost(1);

            await req
                .get(`${SETTINGS.PATH.POSTS}/${invalidPostId}/comments`)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should response with default queries data and empty items array', async () => {
            const {post} = await createdPost(1);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
            expect(res.body.items.length).toBe(0)
        })

        it('should response with default queries data and 1 comment', async () => {
            const {post} = await createdPost(1);
            const comments = await createdCommentsForPostByPostId(1, post.id);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: comments
            });
            expect(res.body.items.length).toBe(1)
        })

        it('should response with default queries data and 5 comment', async () => {
            const {post} = await createdPost(1);
            const comments = await createdCommentsForPostByPostId(5, post.id);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 5,
                items: comments
            });
            expect(res.body.items.length).toBe(5)
        })

        it('should response with default queries data and 10 comment', async () => {
            const {post} = await createdPost(1);
            const comments = await createdCommentsForPostByPostId(25, post.id);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 3,
                page: 1,
                pageSize: 10,
                totalCount: 25,
                items: comments.slice(0, 10)
            });
            expect(res.body.items.length).toBe(10)
        })

        it('should response with queries pageSize=7 pageNumber=3', async () => {
            const {post} = await createdPost(1);
            const comments = await createdCommentsForPostByPostId(40, post.id);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}/comments?pageSize=7&pageNumber=3`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 6,
                page: 3,
                pageSize: 7,
                totalCount: 40,
                items: comments.slice(14, 21)
            });
            expect(res.body.items.length).toBe(7)
        })

        it('should response with queries pageSize=6 pageNumber=4 sortDirection=asc', async () => {
            const {post} = await createdPost(1);
            const comments = await createdCommentsForPostByPostId(40, post.id);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}/comments?pageSize=6&pageNumber=4&sortDirection=asc`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 7,
                page: 4,
                pageSize: 6,
                totalCount: 40,
                items: comments.reverse().slice(18, 24)
            });
            expect(res.body.items.length).toBe(6)
        })

        it('should response with queries pageSize=4 pageNumber=8 sortDirection=asc sortBy=content', async () => {
            const {post} = await createdPost(1);
            const comments = await createdCommentsForPostByPostId(40, post.id);

            const res = await req
                .get(`${SETTINGS.PATH.POSTS}/${post.id}/comments?pageSize=4&pageNumber=8&sortDirection=asc&sortBy=content`)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(res.body).toStrictEqual({
                pagesCount: 10,
                page: 8,
                pageSize: 4,
                totalCount: 40,
                items: comments.sort((a: TComment, b: TComment) => b.content.localeCompare(a.content)).reverse().slice(28, 32)
            });
            expect(res.body.items.length).toBe(4)
        })
    }
)