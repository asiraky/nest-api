import { Test, TestingModule } from '@nestjs/testing'

import { UsersService } from './users.service'

describe('UsersService', () => {
    let service: UsersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        })
            .useMocker((token) => {
                if (token === 'UserRepository') {
                    return {}
                }
            })
            .compile()

        service = module.get<UsersService>(UsersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
