import {TBlog, TPost} from "../db";

export const querySortBy = {
    blogs: Object.keys({} as TBlog) as (keyof TBlog)[],
    posts: Object.keys({} as TPost) as (keyof TPost)[],
}