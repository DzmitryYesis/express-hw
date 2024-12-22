import agent from 'supertest';
import {app} from '../../src/app';
import {SETTINGS} from "../../src/settings";

export const req = agent(app);

export const testDbName = 'test_bd';

export const authBasic = Buffer.from(SETTINGS.AUTH_BASIC, 'utf8').toString('base64');

export const getStringWithLength = (length: number) => {
    return 'a'.repeat(length);
}

export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}