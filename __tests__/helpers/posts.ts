import {TComment, TInputComment, TInputPost, TPost} from "../../src/types";
import {createdBlog} from "./blogs";
import {SETTINGS} from "../../src/settings";
import {authBasic, getStringWithLength, req} from "./test-helper";
import {loggedInUser} from "./users";

export const invalidPostId = '675099c0b6cd777d432a4e91'
export const invalidCommentId = '600099c0b6cd777d432a4e91'

export const createdPostInputBody = (index: number, blogId: string): TInputPost => ({
    title: `post_${index}`,
    content: `content_${index}`,
    shortDescription: `shortDescription_${index}`,
    blogId
})

export const createdCommentInputBody = (index: number) => ({
    content: `comment_${index}` + getStringWithLength(20),
} as TInputComment)

export const createdPost = async (index: number, indexForBlog = 1) => {
    const blog = await createdBlog(indexForBlog);

    const res = await req.post(SETTINGS.PATH.POSTS)
        .set('authorization', `Basic ${authBasic}`)
        .send(createdPostInputBody(index, blog.id))

    const post = res.body as TPost;

    return {blog, post}
}

export const createdCommentForPostByPostId = async (index: number, postId: string) => {
    const {accessToken, user} = await loggedInUser(index);

        const res = await req.post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('authorization', `Bearer ${accessToken}`)
            .send(createdCommentInputBody(index))

    return {comment: res.body as TComment, accessToken, user};
}

export const createdPosts = async (indexes: number, indexForBlog = 1) => {
    const blog = await createdBlog(indexForBlog);

    const postsArray = [] as TPost[];
    for (let i = 1; i <= indexes; i++) {
        const res = await req.post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${authBasic}`)
            .send(createdPostInputBody(i, blog.id))

        postsArray.unshift(res.body as TPost);
    }

    return {blog, postsArray}
}

export const createdCommentsForPostByPostId = async (indexes: number, postId: string) => {
    const {accessToken} = await loggedInUser();

    const commentsArray = [] as TComment[];
    for (let i = 1; i <= indexes; i++) {
        const res = await req.post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('authorization', `Bearer ${accessToken}`)
            .send(createdCommentInputBody(i))

        commentsArray.unshift(res.body as TComment);
    }

    return commentsArray as TComment[];
}