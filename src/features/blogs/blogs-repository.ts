import {blogsCollection, postsCollection, TBlog, TPost} from '../../db';
import {TBlogsQuery, TResponseWithPagination, TInputBlog, TPostsQuery} from '../types';
import {ObjectId, OptionalId} from 'mongodb';

export const blogsRepository = {
    async getBlogs(queryData: TBlogsQuery): Promise<TResponseWithPagination<TBlog[]>> {
        const blogs = await blogsCollection
            .find(queryData.searchNameTerm ? {name: {$regex: queryData.searchNameTerm, $options: 'i'}} : {})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .toArray();

        const totalCount = await blogsCollection.countDocuments(queryData.searchNameTerm ? {name: {$regex: queryData.searchNameTerm, $options: 'i'}} : {});

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
    },
    async getBlogById(id: string): Promise<TBlog | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)});

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
    },
    async getPostForBlogById(id: string, queryData: TPostsQuery): Promise<TResponseWithPagination<TPost[]>> {
        const posts = await postsCollection
            .find({blogId: id})
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments({blogId: id});

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
    async createBlog(data: Omit<TBlog, 'id'>): Promise<TBlog> {
        const result = await blogsCollection.insertOne(data as OptionalId<TBlog>);

        return {
            id: result.insertedId.toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: data.createdAt,
            isMembership: data.isMembership
        }
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },
    async blogsCount(): Promise<number> {
        return await blogsCollection.countDocuments({})
    }
}