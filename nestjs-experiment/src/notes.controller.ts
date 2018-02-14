import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Body, Controller, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, Res} from "@nestjs/common";
import * as express from "express";
import {Repository} from "typeorm";
import {Note} from "./note";
import {EditableNoteAttributesDto, NoteDto} from "./dtos";

@Controller('/notes')
export class NotesController {
    constructor(
        @Inject('NoteRepositoryToken') private readonly noteRepository: Repository<Note>) {}

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
    async createNote(@Body() editableNoteAttributesDto: EditableNoteAttributesDto, @Res() res: express.Response): Promise<void> {
        let note = new Note();
        note.text = editableNoteAttributesDto.text;
        note = await this.noteRepository.save(note);
        res.status(HttpStatus.CREATED).location(`/notes/${note.id}`).end();
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
    async getNote(@Param('id', new ParseIntPipe()) id: number): Promise<NoteDto> {
        const note = await this.noteRepository.findOneById(id);
        if(note == null) {
            throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
        }

        const noteDto = new NoteDto();
        noteDto.id = note.id;
        noteDto.text = note.text;
        return noteDto;
    }
}