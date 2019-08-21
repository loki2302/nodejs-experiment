import "reflect-metadata";
import { expect } from "chai";
import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, MigrationInterface, QueryRunner } from "typeorm";

describe('TypeORM', () => {
    @Entity('Note')
    class Note {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        text: string;
    }

    class InitialMigration1566355129494 implements MigrationInterface {
        up(queryRunner: QueryRunner): Promise<any> {
            return queryRunner.query(`
                create table Note(
                    id integer primary key autoincrement not null,
                    text varchar(100) not null
                )
            `);
        }

        down(queryRunner: QueryRunner): Promise<any> {
            return undefined;
        }
    }

    let connection: Connection;

    beforeEach(async () => {
        connection = await createConnection({
            type: 'sqlite',
            database: 'db',
            entities: [
                Note
            ],
            migrations: [
                InitialMigration1566355129494
            ],
            migrationsRun: true,
            logging: 'all'
        });
    });

    afterEach(async () => {
        await connection.close();
        connection = null;
    });

    it('should work', async () => {
        const note = new Note();
        note.text = 'hello there';

        const savedNote = await connection.manager.save(note);
        expect(savedNote.id).to.not.be.null;
        expect(note.id).to.not.be.null;

        const foundNote = await connection.manager.findOne(Note, note.id);
        expect(foundNote.id).to.equal(note.id);
        expect(foundNote.text).to.equal(note.text);
    });
});
