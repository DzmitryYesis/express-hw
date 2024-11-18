import {commentsRepository} from "../comments";
import {TInputComment} from "../../types";

export const commentsService = {
    async updateCommentById(id: string, data: TInputComment): Promise<boolean> {
        return await commentsRepository.updateCommentById(id, data);
    },
    async deleteCommentById(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(id);
    }
}