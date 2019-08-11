import "reflect-metadata";
import { expect } from "chai";
import {Entity, PrimaryGeneratedColumn, Column, createConnection, Connection} from "typeorm";

describe('typeorm', () => {
    @Entity()
    class Note {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        text: string;
    }

    let connection: Connection;

    beforeEach(async () => {
        connection = await createConnection({
            driver: {
                type: 'sqlite',
                storage: 'db'
            },
            entities: [
                Note
            ],
            logging: {
                logQueries: true,
                logFailedQueryError: true,
                logSchemaCreation: true
            },
            dropSchemaOnConnection: true,
            autoSchemaSync: true
        });
    });

    afterEach(async () => {
        await connection.close();
        connection = null;
    });


    it('should work', async () => {
        const note = new Note();
        note.text = 'hello there';

        const savedNote = await connection.entityManager.persist(note);
        expect(savedNote.id).to.not.be.null;
        expect(note.id).to.not.be.null;

        const foundNote = await connection.entityManager.findOneById(Note, note.id);
        expect(foundNote.id).to.equal(note.id);
        expect(foundNote.text).to.equal(note.text);
    });
});
