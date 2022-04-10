import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'

import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const moduleMocker = new ModuleMocker(global)

describe('UsersController', () => {
    let controller: UsersController
    let mockResults: Partial<User>[] = []
    let canMock: (user: User, _action: string, result: Partial<User>) => boolean

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
        })
            .useMocker((token) => {
                if (token === UsersService) {
                    return { findAll: () => mockResults }
                }
                if (token === CaslAbilityFactory) {
                    return {
                        createForUser: (user: User) => ({
                            can: (arg1: string, arg2: Partial<User>) =>
                                canMock(user, arg1, arg2),
                        }),
                    }
                }
                if (typeof token === 'function') {
                    const mockMetadata = moduleMocker.getMetadata(
                        token,
                    ) as MockFunctionMetadata<any, any>
                    const Mock = moduleMocker.generateFromMetadata(mockMetadata)
                    return new Mock()
                }
            })
            .compile()

        controller = module.get<UsersController>(UsersController)

        canMock = (user: User, _action: string, result: Partial<User>) => {
            return user.id === result.id
        }
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('findAll should filter users that casl says to filter 1', async () => {
        mockResults = [{ id: '1' }, { id: '2' }]

        const request = {
            user: { id: '1' },
        }

        const results = await controller.findAll(request)

        expect(results.length).toBe(1)
    })

    it('findAll should filter users that casl says to filter 2', async () => {
        mockResults = [{}, {}]

        canMock = () => true

        const request = {
            user: {},
        }

        const results = await controller.findAll(request)

        expect(results.length).toBe(2)
    })

    it('findAll should throw when there are users but none that they can see', async () => {
        mockResults = [{ id: '1' }]

        const request = {
            user: { id: '2' },
        }

        await expect(controller.findAll(request)).rejects.toThrow(
            UnauthorizedException,
        )
    })

    it('findAll should return an empty result when there simply are no results to show', async () => {
        mockResults = []

        const request = {
            user: { id: '1' },
        }

        const results = await controller.findAll(request)

        expect(results.length).toBe(0)
    })
})
