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
