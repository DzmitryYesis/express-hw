import {commentsCollection, postsCollection} from "../../db";
import {ObjectId} from "mongodb";
import {
    TCommentsQuery,
    TPostsQuery,
    TResponseWithPagination,
    TComment,
    TPost
} from "../../types";

export const queryPostsRepository = {
    async getPosts(queryData: TPostsQuery): Promise<TResponseWithPagination<TPost[]>> {
        const posts = await postsCollection
            .find({})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments({});

        return {
            pagesCount: Math.ceil(totalCount / +queryData.pageSize),
            page: +queryData.pageNumber,
            pageSize: +queryData.pageSize,
            totalCount,
            items: posts.map(p => ({
                id: p._id.toString(),
                title: p.title,
                content: p.content,
                shortDescription: p.shortDescription,
                blogName: p.blogName,
                blogId: p.blogId,
                createdAt: p.createdAt
            }))
        }
    },
    async getPostById(id: string): Promise<TPost | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)});

        if (post) {
            return {
                id: post._id.toString(),
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogName: post.blogName,
                blogId: post.blogId,
                createdAt: post.createdAt
            }
        }

        return null
    },
    async getCommentsForPostById(id: string, queryData: TCommentsQuery): Promise<TResponseWithPagination<TComment[]>> {
        const comments = await commentsCollection
            .find({postId: id})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .toArray();

        const totalCount = await commentsCollection.countDocuments({postId: id});

        return {
            pagesCount: Math.ceil(totalCount / +queryData.pageSize),
            page: +queryData.pageNumber,
            pageSize: +queryData.pageSize,
            totalCount,
            items: comments.map(c => ({
                id: c._id.toString(),
                content: c.content,
                commentatorInfo: c.commentatorInfo,
                createdAt: c.createdAt
            }))
        }
    },
}