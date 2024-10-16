import {req} from './test-helper';
import {SETTINGS} from '../src/settings';
import {StatusCodeEnum} from '../src/constants';

describe('/', () => {
         beforeAll(async () => {
             await req.delete(SETTINGS.PATH.TESTING).expect(StatusCodeEnum.NO_CONTENT_204)
         })

        it('should get version', async () => {
            const res = await req
                .get('/')
                .expect(200)

            console.log(res.body)

            expect(res.body.version).toBe('1.0')
        })
    }
)