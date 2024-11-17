import {TComment} from "../../db";
import {commentsRepository} from "./comments-repository";
import {TInputComment} from "../types";

export const commentsService = {
    async getCommentById(id: string): Promise<TComment | null> {
        return await commentsRepository.getCommentById(id);

    },
    async updateCommentById(id: string, data: TInputComment): Promise<boolean> {
        return await commentsRepository.updateCommentById(id, data);
    },
    async deleteCommentById(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(id);
    }
}