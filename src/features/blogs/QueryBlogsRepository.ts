import {ObjectId} from "mongodb";
import {TResponseWithPagination, TBlog, TBlogsQuery, TPostsQuery, TPost} from "../../types";
import {BlogModel, PostModel} from "../../db";
import {injectable} from "inversify";

@injectable()
export class QueryBlogsRepository {
    async getBlogs(queryData: TBlogsQuery): Promise<TResponseWithPagination<TBlog[]>> {
        const blogs = await BlogModel
            .find(queryData.searchNameTerm ? {name: {$regex: queryData.searchNameTerm, $options: 'i'}} : {})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .lean();

        const totalCount = await BlogModel.countDocuments(queryData.searchNameTerm ? {
            name: {
                $regex: queryData.searchNameTerm,
                $options: 'i'
            }
        } : {});

        return {
            pagesCount: Math.ceil(totalCount / +queryData.pageSize),
            page: +queryData.pageNumber,
            pageSize: +queryData.pageSize,
            totalCount,
            items: blogs.map(b => ({
                id: b._id.toString(),
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt,
                isMembership: b.isMembership
            })),
        }
    }

    async getBlogById(id: string): Promise<TBlog | null> {
        const blog = await BlogModel.findOne({_id: new ObjectId(id)});

        if (blog) {
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            }
        }

        return null
    }

    async getPostForBlogById(id: string, queryData: TPostsQuery): Promise<TResponseWithPagination<TPost[]>> {
        const posts = await PostModel
            .find({blogId: id})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .lean();

        const totalCount = await PostModel.countDocuments({blogId: id});

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
    }
}
