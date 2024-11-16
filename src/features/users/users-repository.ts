import {TResponseWithPagination, TUsersQuery} from "../types";
import {TUser, TUserDB, usersCollection} from "../../db";
import {ObjectId, OptionalId} from "mongodb";

export const usersRepository = {
    async getUsers(queryData: TUsersQuery): Promise<TResponseWithPagination<TUser[]>> {
        const users = await usersCollection
            .find({
                $or: [
                    queryData.searchLoginTerm ? {login: {$regex: queryData.searchLoginTerm, $options: 'i'}} : {},
                    queryData.searchEmailTerm ? {email: {$regex: queryData.searchEmailTerm, $options: 'i'}} : {}
                ]
            })
            .sort({[queryData.sortBy]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .toArray();

        const totalCount = await usersCollection.countDocuments({
            $or: [
                queryData.searchLoginTerm ? {login: {$regex: queryData.searchLoginTerm, $options: 'i'}} : {},
                queryData.searchEmailTerm ? {email: {$regex: queryData.searchEmailTerm, $options: 'i'}} : {}
            ]
        });

        return {
            pagesCount: Math.ceil(totalCount / +queryData.pageSize),
            page: +queryData.pageNumber,
            pageSize: +queryData.pageSize,
            totalCount,
            items: users.map(u => ({
                id: u._id.toString(),
                login: u.login,
                email: u.email,
                createdAt: u.createdAt
            })),
        }
    },
    async createUser(data: Omit<TUserDB, '_id'>): Promise<TUser> {
        //TODO fix type problem
        // @ts-ignore
        const result = await usersCollection.insertOne(data as OptionalId<TUserDB>);

        return {
            id: result.insertedId.toString(),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string) {
      return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async _findLogin(login: string) {
        return await usersCollection.findOne({login: login});
    },
    async _findEmail(email: string) {
        return await usersCollection.findOne({email: email});
    }
}