import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum TodoEntityStatus {
    NOT_STARTED = 'not-started',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}

@Entity()
export class TodoEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    status: TodoEntityStatus;
}

@Entity()
export class UserEntity {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;
}

@Entity()
export class ClientEntity {
    @PrimaryColumn()
    clientId: string;

    @Column()
    clientSecret: string;

    @Column('simple-array')
    redirectUris: string[];

    @Column('simple-array')
    grants: string[];
}

@Entity()
export class TokenEntity {
    @PrimaryColumn()
    accessToken: string;

    @Column()
    accessTokenExpiresAt: Date;

    @Column({nullable: true})
    refreshToken: string;

    @Column({nullable: true})
    refreshTokenExpiresAt: Date;

    @Column('simple-array')
    scope: string[];

    @Column()
    clientId: string;

    @Column()
    userId: string;
}
