import { Exclude, Expose } from 'class-transformer'
import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class User {
    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }

    @PrimaryColumn()
    id: string

    @Column('varchar', {
        length: 255,
        nullable: false,
    })
    email: string

    @Column({
        nullable: false,
    })
    @Exclude()
    password: string

    @Column({
        nullable: false,
    })
    first_name: string

    @Column({
        nullable: false,
    })
    last_name: string

    @Expose({
        name: 'full_name',
    })
    get fullName(): string {
        return `${this.first_name} ${this.last_name}`
    }

    @Exclude()
    @Column({ default: true })
    active: boolean

    @Column({ default: false })
    is_admin: boolean
}
