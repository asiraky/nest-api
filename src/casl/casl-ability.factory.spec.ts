import { Test } from '@nestjs/testing'
import { User } from '../users/entities/user.entity'

import { CaslAbilityFactory } from './casl-ability.factory'
import { Action } from './constants'

describe('CaslAbilityFactory', () => {
    let abiltyFactory: CaslAbilityFactory
    let aaron: User
    let kate: User
    let admin: User

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CaslAbilityFactory],
        }).compile()

        abiltyFactory = moduleRef.get<CaslAbilityFactory>(CaslAbilityFactory)

        aaron = new User({
            id: '1',
            email: 'asiraky@gmail.com',
            first_name: 'Aaron',
            last_name: 'HS',
            active: true,
            is_admin: false,
            password: 'whatever',
        })

        kate = new User({
            id: '2',
            email: 'kate@gmail.com',
            first_name: 'Kate',
            last_name: 'HS',
            active: true,
            is_admin: false,
            password: 'whatever',
        })

        admin = new User({
            id: '3',
            email: 'admin@gmail.com',
            first_name: 'Admin',
            last_name: 'Person',
            active: true,
            is_admin: true,
            password: 'whatever',
        })
    })

    it('should be defined', () => {
        expect(abiltyFactory).toBeDefined()
    })

    it('admin can do anything to any user', () => {
        const ability = abiltyFactory.createForUser(admin)

        expect(ability.can(Action.Manage, aaron)).toBe(true)
        expect(ability.can(Action.Manage, kate)).toBe(true)
        expect(ability.can(Action.Manage, admin)).toBe(true)
    })

    it('aaron cannot R-U-D kate or admin', () => {
        const ability = abiltyFactory.createForUser(aaron)

        expect(ability.cannot(Action.Read, kate)).toBe(true)
        expect(ability.cannot(Action.Update, kate)).toBe(true)
        expect(ability.cannot(Action.Delete, kate)).toBe(true)

        expect(ability.cannot(Action.Read, admin)).toBe(true)
        expect(ability.cannot(Action.Update, admin)).toBe(true)
        expect(ability.cannot(Action.Delete, admin)).toBe(true)
    })

    it('aaron can R-U self', () => {
        const ability = abiltyFactory.createForUser(aaron)

        expect(ability.can(Action.Read, aaron)).toBe(true)
        expect(ability.can(Action.Update, aaron)).toBe(true)
    })

    it('aaron cannot D self', () => {
        const ability = abiltyFactory.createForUser(aaron)

        expect(ability.cannot(Action.Delete, aaron)).toBe(true)
    })
})
