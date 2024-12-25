import {
    createdCommentForPostByPostId,
    createdCommentInputBody,
    createdPost,
    getStringWithLength,
    invalidCommentId,
    loggedInUser,
    req,
    testDbName
} from "./helpers";
import {SETTINGS} from "../src/settings";
import {HttpStatusCodeEnum, LikeStatusEnum} from "../src/constants";
import {TComment, TInputComment, TInputLikeComment} from "../src/types";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

describe('test CRUD flow for comments', () => {
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

    it('should return response with error NOT_FOUND for like comment request', async () => {
        const {post} = await createdPost(1);
        const {accessToken} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${invalidCommentId}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NOT_FOUND_404)
    })

    it('should return response with error NOT_AUTH for like comment request', async () => {
        const {post} = await createdPost(1);
        const {comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${'bla-bla-token'}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NOT_AUTH_401)
    })

    it('should return response with error BAD_REQUEST when send likeStatus: `` for like comment request', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        const res = await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: ''} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'likeStatus',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should return response with error BAD_REQUEST when send likeStatus: wrong format', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        const res = await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'lliikkee'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(res.body.errorsMessages)).toBe(true);
        expect(res.body.errorsMessages).toHaveLength(1);

        expect(res.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'likeStatus',
                    message: expect.any(String),
                }),
            ])
        );
    })

    it('should add like for comment', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: LikeStatusEnum.LIKE
            }
        } as TComment)
    })

    it('should add like for comment and show myStatus: None for non auth user', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: LikeStatusEnum.NONE
            }
        } as TComment)
    })

    it('should add like, then dislike for comment and show myStatus: dislike for user', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Dislike'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: LikeStatusEnum.DISLIKE
            }
        } as TComment)
    })

    it('should add like, then dislike for comment and show myStatus: None for non auth user', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Dislike'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: LikeStatusEnum.NONE
            }
        } as TComment)
    })

    it('should add like, then like for comment and show myStatus: Like for user', async () => {
        const {post} = await createdPost(1);
        const {accessToken, comment} = await createdCommentForPostByPostId(1, post.id)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: LikeStatusEnum.LIKE
            }
        } as TComment)
    })

    it('should add like from user1, then dislike from user2, show myStatus: Like for user1 and dislike for user2', async () => {
        const {post} = await createdPost(1);
        const {accessToken: user1Token, comment} = await createdCommentForPostByPostId(1, post.id)
        const {accessToken: user2Token} = await loggedInUser(2);

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${user1Token}`)
            .send({likeStatus: 'Like'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}/like-status`)
            .set('authorization', `Bearer ${user2Token}`)
            .send({likeStatus: 'Dislike'} as TInputLikeComment)
            .expect(HttpStatusCodeEnum.NO_CONTENT_204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${user1Token}`)
            .expect(HttpStatusCodeEnum.OK_200)

        console.log(res.body)

        expect(res.body).toStrictEqual({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: 1,
                dislikesCount: 1,
                myStatus: LikeStatusEnum.LIKE
            }
        } as TComment)
    })
});