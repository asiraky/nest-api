import {
    Ability,
    AbilityBuilder,
    AbilityClass,
    ExtractSubjectType,
    InferSubjects,
} from '@casl/ability'
import { Injectable } from '@nestjs/common'

import { User } from '../users/entities/user.entity'
import { Action } from './constants'

type Subjects = InferSubjects<typeof User> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
            Ability as AbilityClass<AppAbility>,
        )

        if (user.is_admin) {
            can(Action.Manage, 'all')
        } else {
            can(Action.Read, User, { id: user.id })
            can(Action.Update, User, { id: user.id })
        }

        return build({
            // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) => {
                return item.constructor as ExtractSubjectType<Subjects>
            },
        })
    }
}
