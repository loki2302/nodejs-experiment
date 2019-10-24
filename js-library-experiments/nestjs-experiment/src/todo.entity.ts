import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TodoEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    text: string;
}
