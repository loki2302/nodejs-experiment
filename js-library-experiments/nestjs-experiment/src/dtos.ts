import {ApiModelProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class EditableNoteAttributesDto {
    @ApiModelProperty({
        description: 'Note text'
    })
    @IsString()
    @IsNotEmpty()
    text: string;
}

export class NoteDto extends EditableNoteAttributesDto {
    @ApiModelProperty({
        description: 'Note ID'
    })
    id: number;
}
