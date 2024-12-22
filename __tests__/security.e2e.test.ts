import {
    createdUser,
    invalidRefreshToken,
    loggedInUser,
    loggedMultiDevicesUser,
    req,
    testDbName
} from "./helpers";
import {SETTINGS} from "../src/settings";
import {HttpStatusCodeEnum} from "../src/constants";
import {TDevice} from "../src/types/viewModels";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

//TODO problem with test with update sessions
describe('tests for security endpoints', () => {
    const mongoURI = process.env.MONGO_URL || SETTINGS.MONGO_URL

        beforeAll(async () => {
            await mongoose.connect(`${mongoURI}/${testDbName}`)

            await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
        })

        afterEach(async () => {
            await req.delete(SETTINGS.PATH.TESTING).expect(HttpStatusCodeEnum.NO_CONTENT_204)
        })

        afterAll(async () => {
            await mongoose.connection.close()
        });

        it('should return response with error NOT_AUTH', async () => {
            await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('should return response with error NOT_AUTH when use invalid refresh token', async () => {
            await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', invalidRefreshToken)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('should return response with 1 current session', async () => {
            const {refreshTokenCookie} = await loggedInUser(1);

            const res = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ip: expect.any(String),
                        title: expect.any(String),
                        lastActiveDate: expect.any(String),
                        deviceId: expect.any(String),
                    }),
                ])
            );
        })

        it('should return response with 4 current sessions with different devices', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            await loggedMultiDevicesUser(user.login, password, 'Device 2');
            await loggedMultiDevicesUser(user.login, password, 'Device 3');
            const {refreshTokenCookie} = await loggedMultiDevicesUser(user.login, password, 'Device 4');

            const res = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(4);
        })

        /*it('should return response with 4 current sessions with different update time for device 2', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            const {refreshTokenCookie: refreshTokenCookieDevice2} = await loggedMultiDevicesUser(user.login, password, 'Device 2');
            await loggedMultiDevicesUser(user.login, password, 'Device 3');
            const {refreshTokenCookie: refreshTokenCookieDevice4} = await loggedMultiDevicesUser(user.login, password, 'Device 4');

            const resBeforeUpdate = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookieDevice4!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log('4 sessions', resBeforeUpdate.body)

            expect(Array.isArray(resBeforeUpdate.body)).toBe(true);
            expect(resBeforeUpdate.body.length).toBe(4);

            const device2BeforeUpdate = resBeforeUpdate.body.find((d: TDevice) => d.title === 'Device 2')

            await sleep(4000);

            await req
                .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
                .set('Cookie', refreshTokenCookieDevice2!)
                .expect(HttpStatusCodeEnum.OK_200)

            const resAfterUpdate = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookieDevice4!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log('4 sessions after update', resAfterUpdate.body)

            expect(Array.isArray(resAfterUpdate.body)).toBe(true);
            expect(resAfterUpdate.body.length).toBe(4);

            const device2AfterUpdate = resAfterUpdate.body.find((d: TDevice) => d.title === 'Device 2')

            expect(device2BeforeUpdate.lastActiveDate).not.toEqual(device2AfterUpdate.lastActiveDate);
        })*/

        it('should return response with 3 sessions with different devices after logout device number 2', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            const {refreshTokenCookie: refreshTokenCookieDevice2} = await loggedMultiDevicesUser(user.login, password, 'Device 2');
            await loggedMultiDevicesUser(user.login, password, 'Device 3');
            const {refreshTokenCookie: refreshTokenCookieDevice4} = await loggedMultiDevicesUser(user.login, password, 'Device 4');

            const res = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookieDevice4!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(res.body)

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(4);

            await req
                .post(`${SETTINGS.PATH.AUTH}/logout`)
                .set('Cookie', refreshTokenCookieDevice2!)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)

            const resAfterLogoutDevice2 = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookieDevice4!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resAfterLogoutDevice2.body)

            const notDevice2 = resAfterLogoutDevice2.body.every((d: TDevice) => d.title !== 'Device 2')

            expect(Array.isArray(resAfterLogoutDevice2.body)).toBe(true);
            expect(resAfterLogoutDevice2.body.length).toBe(3);
            expect(notDevice2).toBe(true);
        })

        it('should return error NOT_AUTH for request delete devices', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            await loggedMultiDevicesUser(user.login, password, 'Device 2');
            await loggedMultiDevicesUser(user.login, password, 'Device 3');
            await loggedMultiDevicesUser(user.login, password, 'Device 4');

            await req
                .delete(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', invalidRefreshToken)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('should return delete all devices exclude current', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            await loggedMultiDevicesUser(user.login, password, 'Device 2');
            await loggedMultiDevicesUser(user.login, password, 'Device 3');
            const {refreshTokenCookie} = await loggedMultiDevicesUser(user.login, password, 'Device 4');

            const resGet = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resGet.body)

            expect(Array.isArray(resGet.body)).toBe(true);
            expect(resGet.body.length).toBe(4);

            await req
                .delete(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)

            const resAfterDelete = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resAfterDelete.body)

            expect(Array.isArray(resAfterDelete.body)).toBe(true);
            expect(resAfterDelete.body.length).toBe(1);
            expect(resAfterDelete.body[0].title).toEqual('Device 4')
        })

        it('should return response with error NOT_AUTH when try to delete device by id', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            const {refreshTokenCookie} = await loggedMultiDevicesUser(user.login, password, 'Device 2');

            const resGet = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resGet.body)

            expect(Array.isArray(resGet.body)).toBe(true);
            expect(resGet.body.length).toBe(2);

            const device1 = resGet.body.find((d: TDevice) => d.title === 'Device 1') as TDevice

            await req
                .delete(`${SETTINGS.PATH.SECURITY}/${device1.deviceId}`)
                .set('Cookie', invalidRefreshToken)
                .expect(HttpStatusCodeEnum.NOT_AUTH_401)
        })

        it('should return response with error NOT_FOUND when try to delete unreal device', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            const {refreshTokenCookie} = await loggedMultiDevicesUser(user.login, password, 'Device 2');

            const resGet = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resGet.body)

            expect(Array.isArray(resGet.body)).toBe(true);
            expect(resGet.body.length).toBe(2);

            await req
                .delete(`${SETTINGS.PATH.SECURITY}/19c14589-bf0e-464b-93a8-dffcdc7blabla`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should return delete device session by device id', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            const {refreshTokenCookie} = await loggedMultiDevicesUser(user.login, password, 'Device 2');

            const resGet = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resGet.body)

            expect(Array.isArray(resGet.body)).toBe(true);
            expect(resGet.body.length).toBe(2);

            const device1 = resGet.body.find((d: TDevice) => d.title === 'Device 1') as TDevice

            await req
                .delete(`${SETTINGS.PATH.SECURITY}/${device1.deviceId}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)
        })

        it('should return response with error NOT_FOUND when try to delete device what delete early', async () => {
            const {user, password} = await createdUser(1);
            await loggedMultiDevicesUser(user.login, password, 'Device 1');
            const {refreshTokenCookie} = await loggedMultiDevicesUser(user.login, password, 'Device 2');

            const resGet = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resGet.body)

            expect(Array.isArray(resGet.body)).toBe(true);
            expect(resGet.body.length).toBe(2);

            const device1 = resGet.body.find((d: TDevice) => d.title === 'Device 1') as TDevice

            await req
                .delete(`${SETTINGS.PATH.SECURITY}/${device1.deviceId}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.NO_CONTENT_204)

            await req
                .delete(`${SETTINGS.PATH.SECURITY}/${device1.deviceId}`)
                .set('Cookie', refreshTokenCookie!)
                .expect(HttpStatusCodeEnum.NOT_FOUND_404)
        })

        it('should return response with error FORBIDDEN', async () => {
            const {user: user1, password: password1} = await createdUser(1);
            const {refreshTokenCookie: refreshTokenCookie1} = await loggedMultiDevicesUser(user1.login, password1, 'Device1 1');
            const {user: user2, password: password2} = await createdUser(2);
            const {refreshTokenCookie: refreshTokenCookie2} = await loggedMultiDevicesUser(user2.login, password2, 'Device2 1');

            const resSessionUser1 = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie1!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resSessionUser1.body)

            expect(Array.isArray(resSessionUser1.body)).toBe(true);
            expect(resSessionUser1.body.length).toBe(1);

            const resSessionUser2 = await req
                .get(`${SETTINGS.PATH.SECURITY}`)
                .set('Cookie', refreshTokenCookie2!)
                .expect(HttpStatusCodeEnum.OK_200)

            console.log(resSessionUser2.body)

            expect(Array.isArray(resSessionUser2.body)).toBe(true);
            expect(resSessionUser1.body.length).toBe(1);

            const device2 = resSessionUser2.body.find((d: TDevice) => d.title === 'Device2 1') as TDevice

            await req
                .delete(`${SETTINGS.PATH.SECURITY}/${device2.deviceId}`)
                .set('Cookie', refreshTokenCookie1!)
                .expect(HttpStatusCodeEnum.FORBIDDEN_403)
        })
    }
)