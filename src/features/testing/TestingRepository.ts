import {
    BlogModel,
    CommentModel,
    LogRequestModel,
    PasswordRecoveryModel,
    PostModel,
    SessionModel,
    UserModel
} from "../../db";

export class TestingRepository {
    async deleteAllData() {
        await BlogModel.deleteMany({});
        await PostModel.deleteMany({});
        await UserModel.deleteMany({});
        await CommentModel.deleteMany({});
        await SessionModel.deleteMany({});
        await LogRequestModel.deleteMany({});
        await PasswordRecoveryModel.deleteMany({});
    }
}