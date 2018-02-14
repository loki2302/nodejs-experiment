import "reflect-metadata";
import {NestFactory} from "@nestjs/core";
import {Body, Controller, Get, Module, Param, Post} from "@nestjs/common";
import {ApiModelProperty, ApiOperation, ApiResponse, DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export class EditableNoteAttributesDto {
    @ApiModelProperty({
        description: 'Note text'
    })
    readonly text: string;
}

export class NoteDto extends EditableNoteAttributesDto {
    @ApiModelProperty({
        description: 'Note ID'
    })
    readonly id: string;
}

@Controller('/notes')
export class NotesController {
    @ApiOperation({
        title: 'Create a note',
        description: 'Yes, create a note.'
    })
    @ApiResponse({
        status: 201,
        description: 'Successfully created a note'
    })
    @ApiResponse({
        status: 400,
        description: 'Something is wrong with your request'
    })
    @Post()
    createNote(@Body() editableNoteAttributesDto: EditableNoteAttributesDto) {
        // TODO
    }

    @ApiOperation({
        title: 'Get a note',
        description: 'Get a note definitely.'
    })
    @ApiResponse({
        status: 200,
        description: 'Found a note, providing its contents',
        type: NoteDto
    })
    @ApiResponse({
        status: 404,
        description: 'Did not find the note'
    })
    @Get(':id')
    getNote(@Param('id') id: string): NoteDto {
        // TODO
        return new NoteDto();
    }
}

@Module({
    imports: [],
    controllers: [
        NotesController
    ],
    components: []
})
export class AppModule {
}

(async () => {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Notes API')
        .setDescription('Use this API to work with notes.')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(3000);
})();
