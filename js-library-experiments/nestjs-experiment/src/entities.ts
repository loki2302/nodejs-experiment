import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export enum TodoEntityStatus {
    NOT_STARTED = 'not-started',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}

@Entity()
export class UserEntity {
    @PrimaryColumn()
    username: string;

    @Column({ nullable: false })
    password: string;
}

@Entity()
export class TodoEntity {
    @PrimaryColumn()
    id: number;

    @Column({ nullable: false })
    text: string;

    @Column({ nullable: false })
    status: TodoEntityStatus;

    @ManyToOne(type => UserEntity, { nullable: false })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity()
export class ClientEntity {
    @PrimaryColumn()
    clientId: string;

    @Column({ nullable: false })
    clientSecret: string;

    @Column('simple-array', { nullable: false })
    redirectUris: string[];

    @Column('simple-array', { nullable: false })
    grants: string[];
}

@Entity()
export class TokenEntity {
    @PrimaryColumn()
    accessToken: string;

    @Column({ nullable: false })
    accessTokenExpiresAt: Date;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    refreshTokenExpiresAt: Date;

    @Column('simple-array', { nullable: false })
    scope: string[];

    @ManyToOne(type => ClientEntity, { nullable: false })
    client: ClientEntity;

    @ManyToOne(type => UserEntity, { nullable: false })
    user: UserEntity;
}
