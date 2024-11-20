import {commentsRepository} from "../comments";
import {TInputComment, TResultServiceObj} from "../../types";
import {TCommentDB} from "../../db";
import {createServiceResultObj} from "../../utils";

export const commentsService = {
    async findCommentById(id: string): Promise<TResultServiceObj<TCommentDB>> {
        const comment = await commentsRepository.findCommentById(id);
        if (comment) {
            return createServiceResultObj<TCommentDB>("SUCCESS", "OK", comment);
        }

        return createServiceResultObj("REJECT", "NOT_FOUND");
    },
    async updateCommentById(userId: string, id: string, data: TInputComment): Promise<TResultServiceObj> {
        const {result, status, data: findCommentByIdData} = await this.findCommentById(id);

        if (result === "SUCCESS") {
            if (findCommentByIdData!.commentatorInfo.userId === userId) {
                await commentsRepository.updateCommentById(id, data);

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }

            return createServiceResultObj("REJECT", "FORBIDDEN")
        }

        return createServiceResultObj(result, status);
    },
    async deleteCommentById(userId: string, id: string): Promise<TResultServiceObj> {
        const {result, status, data} = await this.findCommentById(id);

        if (result === "SUCCESS") {
            if (data!.commentatorInfo.userId === userId) {
                await commentsRepository.deleteCommentById(id);

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }

            return createServiceResultObj("REJECT", "FORBIDDEN")
        }

        return createServiceResultObj(result, status);
    }
}