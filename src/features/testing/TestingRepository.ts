import {
    BlogModel,
    CommentModel,
    LogRequestModel,
    PasswordRecoveryModel,
    PostModel,
    SessionModel,
    UserModel
} from "../../db";
import {injectable} from "inversify";

@injectable()
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