import {ObjectId} from "mongodb";
import {
    TCommentsQuery,
    TPostsQuery,
    TResponseWithPagination,
    TComment,
    TPost
} from "../../types";
import {CommentModel, PostModel} from "../../db/models";

export const queryPostsRepository = {
    async getPosts(queryData: TPostsQuery): Promise<TResponseWithPagination<TPost[]>> {
        const posts = await PostModel
            .find({})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .lean();

        const totalCount = await PostModel.countDocuments({});

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
        const post = await PostModel.findOne({_id: new ObjectId(id)});

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
        const comments = await CommentModel
            .find({postId: id})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .lean();

        const totalCount = await CommentModel.countDocuments({postId: id});

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