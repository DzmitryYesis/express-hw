import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";

type TAccessTokenData = {
    userId: string,
    iat: number,
    exp: number
}

type TRefreshTokenData = {
    refreshToken: string,
    deviceId: string,
    userId: string,
    iat: number,
    exp: number
}

export const jwtService = {
    async createAccessJWT(userId: ObjectId): Promise<string> {
        return jwt.sign({userId: userId}, SETTINGS.JWT_ACCESS_TOKEN_SECRET, {expiresIn: SETTINGS.JWT_ACCESS_TOKEN_EXPIRES_TIME});
    },
    async createRefreshJWT(deviceId: string, userId: string): Promise<TRefreshTokenData> {
        const refreshToken = jwt.sign({deviceId, userId}, SETTINGS.JWT_REFRESH_TOKEN_SECRET, {expiresIn: SETTINGS.JWT_REFRESH_TOKEN_EXPIRES_TIME});
        const refreshTokenPayload = jwt.decode(refreshToken) as Omit<TRefreshTokenData, 'refreshToken'>;

        return {
            refreshToken,
            deviceId: refreshTokenPayload.deviceId,
            userId: refreshTokenPayload.userId,
            exp: refreshTokenPayload.exp,
            iat: refreshTokenPayload.iat
        }
    },
    async decodeRefreshToken(token: string): Promise<Omit<TRefreshTokenData, 'refreshToken'>> {
        return jwt.decode(token) as Omit<TRefreshTokenData, 'refreshToken'>;
    },
    async decodeAccessToken(token: string): Promise<TAccessTokenData> {
        return jwt.decode(token) as TAccessTokenData;
    },
    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            const result = jwt.verify(token, SETTINGS.JWT_ACCESS_TOKEN_SECRET) as TAccessTokenData;

            return new ObjectId(result.userId)
        } catch (e) {
            return null
        }
    },
    async isTokenExpired(token: string, key: string): Promise<boolean> {
        try {
            jwt.verify(token, key);
            return false
        } catch (e) {
            return true
        }
    },
    async isValidJWTFormat(token: string): Promise<boolean> {
        const jwtParts = token.split(".");

        if (jwtParts.length !== 3) {
            return false;
        }

        try {
            jwtParts.forEach(part => {
                atob(part.replace(/-/g, "+").replace(/_/g, "/"));
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}