import { Body, Controller, Get, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { Repository } from 'typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino/dist';
import { ApiOperation, ApiModelProperty, ApiUseTags, ApiResponse, ApiImplicitParam, ApiImplicitBody, ApiImplicitQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Todo {
    @ApiModelProperty({ description: 'Todo ID' })
    id: number;

    @ApiModelProperty({ description: 'Todo text' })
    text: string;
}

export class PutTodoBody {
    @ApiModelProperty({ description: 'Todo text' })
    @IsString()
    @IsNotEmpty()
    text: string;
}

export class TodosPage {
    @ApiModelProperty({ description: 'Total number of todos' })
    total: number;

    @ApiModelProperty({ description: 'Number of todos skipped' })
    skip: number;

    @ApiModelProperty({ description: 'Number of todos taken' })
    take: number;

    @ApiModelProperty({ isArray: true, type: Todo, description: 'Todos' })
    items: Todo[];
}

@ApiUseTags('todos')
@Controller('todos')
@UsePipes(new ValidationPipe())
export class TodoController {
    constructor(
        @InjectPinoLogger(TodoController.name) private readonly logger: PinoLogger,
        @InjectRepository(TodoEntity) private readonly todoEntityRepository: Repository<TodoEntity>) {
    }

    @ApiOperation({ title: 'Create or update a todo', description: 'Creates or updates a todo' })
    @ApiImplicitParam({ name: 'id', description: 'Todo ID' })
    @ApiImplicitBody({ name: 'PutTodoBody', type: PutTodoBody, description: 'Todo details' })
    @ApiResponse({ status: 200, description: 'Successfully created or updated a todo' })
    @Put(':id')
    async putTodo(
        @Param('id') id: number,
        @Body() body: PutTodoBody): Promise<void> {

        let todo = await this.todoEntityRepository.findOne(id);
        if (todo === undefined) {
            todo = new TodoEntity();
            todo.id = id;
        }
        todo.text = body.text;

        await this.todoEntityRepository.save(todo);
    }

    @ApiOperation({ title: 'Get all todos', description: 'Gets all todos with pagination' })
    @ApiImplicitQuery({ name: 'skip', required: false, description: 'Number of todos to skip' })
    @ApiImplicitQuery({ name: 'take', required: false, description: 'Number of todos to take' })
    @ApiResponse({ status: 200, description: 'A collection of todos', type: TodosPage })
    @Get()
    async getTodos(
        @Query('skip') skip: number = 0,
        @Query('take') take: number = 10): Promise<TodosPage> {

        this.logger.info({skip, take}, 'get todos');

        const [todos, count] = await this.todoEntityRepository.findAndCount({ skip, take });
        return {
            total: count,
            skip,
            take,
            items: todos.map(todo => ({
                id: todo.id,
                text: todo.text
            }))
        };
    }
}
