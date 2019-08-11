import {Module} from "@nestjs/common";
import {Connection, createConnection} from "typeorm";
import {NotesController} from "./notes.controller";
import {Note} from "./note";

export const databaseProviders = [
    {
        provide: 'DbConnectionToken',
        useFactory: async () => await createConnection({
            type: 'sqlite',
            database: 'dummy.db',
            entities: [
                Note
            ],
            synchronize: true
        })
    }
];

export const noteProviders = [
    {
        provide: 'NoteRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Note),
        inject: [ 'DbConnectionToken' ]
    }
];

@Module({
    imports: [],
    controllers: [
        NotesController
    ],
    components: [
        ...databaseProviders,
        ...noteProviders
    ]
})
export class AppModule {
}
