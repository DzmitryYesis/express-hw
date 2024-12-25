import {
    TResponseWithPagination,
    TUser,
    TUsersQuery,
    TPersonalData
} from "../../types";
import {ObjectId} from "mongodb";
import {UserModel} from "../../db";
import {injectable} from "inversify";

@injectable()
export class QueryUsersRepository {
    async getUsers(queryData: TUsersQuery): Promise<TResponseWithPagination<TUser[]>> {
        const users = await UserModel
            .find({
                $or: [
                    queryData.searchLoginTerm ? {'accountData.login': {$regex: queryData.searchLoginTerm, $options: 'i'}} : {},
                    queryData.searchEmailTerm ? {'accountData.email': {$regex: queryData.searchEmailTerm, $options: 'i'}} : {}
                ]
            })
            .sort({[`accountData.${queryData.sortBy}`]: queryData.sortDirection === 'asc' ? 1 : -1})
            .skip((+queryData.pageNumber - 1) * +queryData.pageSize)
            .limit(+queryData.pageSize)
            .lean();

        const totalCount = await UserModel.countDocuments({
            $or: [
                queryData.searchLoginTerm ? {'accountData.login': {$regex: queryData.searchLoginTerm, $options: 'i'}} : {},
                queryData.searchEmailTerm ? {'accountData.email': {$regex: queryData.searchEmailTerm, $options: 'i'}} : {}
            ]
        });

        return {
            pagesCount: Math.ceil(totalCount / +queryData.pageSize),
            page: +queryData.pageNumber,
            pageSize: +queryData.pageSize,
            totalCount,
            items: users.map(u => ({
                id: u._id.toString(),
                login: u.accountData.login,
                email: u.accountData.email,
                createdAt: u.accountData.createdAt
            })),
        }
    }

    async getUserById(id: string): Promise<TUser | null> {
        const user = await UserModel.findOne({_id: new ObjectId(id)});

        if (user) {
            return {
                id: user._id.toString(),
                login: user.accountData.login,
                email: user.accountData.email,
                createdAt: user.accountData.createdAt
            }
        }

        return null;
    }

    async getUserPersonalData(id: string): Promise<TPersonalData | null> {
        const user = await UserModel.findOne({_id: new ObjectId(id)});

        if (user) {
            return {
                login: user.accountData.login,
                email: user.accountData.email,
                userId: user._id.toString(),
            }
        }

        return null;
    }
}