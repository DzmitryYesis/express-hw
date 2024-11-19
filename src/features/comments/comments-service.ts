import {commentsRepository} from "../comments";
import {TInputComment} from "../../types";
import {TCommentDB} from "../../db";

export const commentsService = {
    async findCommentById(id: string): Promise<TCommentDB | null> {
        return await commentsRepository.findCommentById(id);
    },
    async updateCommentById(id: string, data: TInputComment): Promise<boolean> {
        return await commentsRepository.updateCommentById(id, data);
    },
    async deleteCommentById(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(id);
    }
}