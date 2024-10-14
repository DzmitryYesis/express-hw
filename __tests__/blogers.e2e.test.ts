import {req} from './test-helper';

describe('/', () => {
        // beforeAll(async () => { // очистка базы данных перед началом тестирования
        //     setDB()
        // })

        it('should get version', async () => {
            const res = await req
                .get('/')
                .expect(200)

            console.log(res.body)

            expect(res.body.version).toBe('1.0')
        })
    }
)