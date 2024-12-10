import {MongoMemoryServer} from "mongodb-memory-server";
import {MongoClient} from "mongodb";
import {
    createdCommentForPostByPostId,
    createdCommentInputBody,
    createdPost,
    getStringWithLength,
    invalidCommentId,
    req
} from "./helpers";
import {SETTINGS} from "../src/settings";
import {HttpStatusCodeEnum} from "../src/constants";
import {TComment, TInputComment} from "../src/types";

let mongoServer: MongoMemoryServer;
let client: MongoClient;

describe('test CRUD flow for comments', () => {
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

    it('should return response with error NOT_FOUND_404', async () => {
        const {post} = await createdPost(1);
        await createdCommentForPostByPostId(1, post.id)

        await req
            .get(`${SETTINGS.PATH.COMMENTS}/${invalidCommentId}`)
            .expect(HttpStatusCodeEnum.NOT_FOUND_404)
    })

    it('should return comment by commentId', async () => {
        const {post} = await createdPost(1);
        const {comment} = await createdCommentForPostByPostId(1, post.id)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual(comment);
    })

    it('shouldn\'t delete comment without auth', async () => {
        const {post} = await createdPost(1);
        const {comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Basic bla-bla`)
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('shouldn\'t delete comment by invalid commentId', async () => {
        const {post} = await createdPost(1);
        const {accessToken} = await createdCommentForPostByPostId(1, post.id)

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${invalidCommentId}`)
            .set('authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodeEnum.NOT_FOUND_404)
    })

    it('shouldn\'t delete comment by other user', async () => {
        const {post: post1} = await createdPost(1, 1);
        const {accessToken: accessToken1} = await createdCommentForPostByPostId(1, post1.id)

        const {post: post2} = await createdPost(2, 2);
        const {comment: comment2} = await createdCommentForPostByPostId(2, post2.id)

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${comment2.id}`)
            .set('authorization', `Bearer ${accessToken1}`)
            .expect(HttpStatusCodeEnum.FORBIDDEN_403)
    })

    it('should delete comment by commentId', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)
    })

    it('shouldn\'t update comment without auth', async () => {
        const {post} = await createdPost(1);
        const {comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Basic bla-bla`)
            .send(createdCommentInputBody(1))
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('shouldn\'t update comment by invalid commentId', async () => {
        const {post} = await createdPost(1);
        const {accessToken} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${invalidCommentId}`)
            .set('authorization', `Bearer ${accessToken}`)
            .send(createdCommentInputBody(1))
            .expect(HttpStatusCodeEnum.NOT_FOUND_404)
    })

    it('shouldn\'t update comment by other user', async () => {
        const {post: post1} = await createdPost(1, 1);
        const {accessToken: accessToken1} = await createdCommentForPostByPostId(1, post1.id)

        const {post: post2} = await createdPost(2, 2);
        const {comment: comment2} = await createdCommentForPostByPostId(2, post2.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment2.id}`)
            .set('authorization', `Bearer ${accessToken1}`)
            .send(createdCommentInputBody(1))
            .expect(HttpStatusCodeEnum.FORBIDDEN_403)
    })

    it('should return response with error BAD_REQUEST_400 for small content length', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        const res = await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
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

    it('should return response with error BAD_REQUEST_400 for large content length', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        const res = await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
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

    it('should update comment', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)
        const contentForUpdate = createdCommentInputBody(2)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${accessToken}`)
            .send(contentForUpdate)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({...comment, content: contentForUpdate.content} as TComment);
    })
});