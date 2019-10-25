import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity, TodoEntityStatus } from './todo.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino/dist';
import { ApiImplicitBody, ApiImplicitParam, ApiImplicitQuery, ApiModelProperty, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export enum TodoStatus {
    NOT_STARTED = 'not-started',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}

export enum TodoSortOrder {
    ID = 'id',
    TEXT = 'text',
    STATUS = 'status'
}

export enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc'
}

export class Todo {
    @ApiModelProperty({ description: 'Todo ID' })
    id: number;

    @ApiModelProperty({ description: 'Todo text' })
    text: string;

    @ApiModelProperty({ description: 'Todo status', enum: Object.values(TodoStatus) })
    status: TodoStatus;
}

export class PutTodoBody {
    @ApiModelProperty({ description: 'Todo text' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiModelProperty({ description: 'Todo status', enum: Object.values(TodoStatus) })
    @IsIn(Object.values(TodoStatus))
    status: TodoStatus;
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

function todoStatusFromTodoEntityStatus(todoEntityStatus: TodoEntityStatus): TodoStatus {
    if (todoEntityStatus === TodoEntityStatus.NOT_STARTED) {
        return TodoStatus.NOT_STARTED;
    } else if (todoEntityStatus === TodoEntityStatus.IN_PROGRESS) {
        return TodoStatus.IN_PROGRESS;
    } else if (todoEntityStatus === TodoEntityStatus.DONE) {
        return TodoStatus.DONE;
    } else {
        throw new Error(`Don't know how to convert TodoEntityStatus ${todoEntityStatus}`);
    }
}

function todoEntityStatusFromTodoStatus(todoStatus: TodoStatus): TodoEntityStatus {
    if (todoStatus === TodoStatus.NOT_STARTED) {
        return TodoEntityStatus.NOT_STARTED;
    } else if (todoStatus === TodoStatus.IN_PROGRESS) {
        return TodoEntityStatus.IN_PROGRESS;
    } else if (todoStatus === TodoStatus.DONE) {
        return TodoEntityStatus.DONE;
    } else {
        throw new Error(`Don't know how to convert TodoStatus ${todoStatus}`);
    }
}

function todoFromTodoEntity(todoEntity: TodoEntity): Todo {
    let status: TodoStatus;
    if (todoEntity.status === TodoEntityStatus.NOT_STARTED) {
        status = TodoStatus.NOT_STARTED;
    } else if (todoEntity.status === TodoEntityStatus.IN_PROGRESS) {
        status = TodoStatus.IN_PROGRESS;
    } else if (todoEntity.status === TodoEntityStatus.DONE) {
        status = TodoStatus.DONE;
    } else {
        throw new Error(`Don't know how to convert TodoEntityStatus ${todoEntity.status}`);
    }

    const todo = new Todo();
    todo.id = todoEntity.id;
    todo.text = todoEntity.text;
    todo.status = todoStatusFromTodoEntityStatus(todoEntity.status);
    return todo;
}

@ApiUseTags('todos')
@Controller('todos')
@UsePipes(new ValidationPipe())
export class TodoController {
    constructor(
        @InjectPinoLogger(TodoController.name) private readonly logger: PinoLogger,
        @InjectRepository(TodoEntity) private readonly todoEntityRepository: Repository<TodoEntity>) {
    }

    @ApiOperation({ title: 'Get a todo', description: 'Gets a todo' })
    @ApiImplicitParam({ name: 'id', description: 'Todo ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Found a todo' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No such todo' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getTodo(@Param('id') id: number): Promise<Todo> {
        const todoEntity = await this.todoEntityRepository.findOne(id);
        if (todoEntity === undefined) {
            throw new HttpException('no such todo', HttpStatus.NOT_FOUND);
        }

        return todoFromTodoEntity(todoEntity);
    }

    @ApiOperation({ title: 'Delete a todo', description: 'Deletes a todo' })
    @ApiImplicitParam({ name: 'id', description: 'Todo ID' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Deleted a todo' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No such todo' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTodo(@Param('id') id: number): Promise<void> {
        const todoEntity = await this.todoEntityRepository.findOne(id);
        if (todoEntity === undefined) {
            throw new HttpException('no such todo', HttpStatus.NOT_FOUND);
        }

        await this.todoEntityRepository.delete(todoEntity);
    }

    @ApiOperation({ title: 'Create or update a todo', description: 'Creates or updates a todo' })
    @ApiImplicitParam({ name: 'id', description: 'Todo ID' })
    @ApiImplicitBody({ name: 'PutTodoBody', type: PutTodoBody, description: 'Todo details' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully created or updated a todo' })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async putTodo(
        @Param('id') id: number,
        @Body() body: PutTodoBody): Promise<void> {

        let todoEntity = await this.todoEntityRepository.findOne(id);
        if (todoEntity === undefined) {
            todoEntity = new TodoEntity();
            todoEntity.id = id;
        }
        todoEntity.text = body.text;
        todoEntity.status = todoEntityStatusFromTodoStatus(body.status);

        await this.todoEntityRepository.save(todoEntity);
    }

    @ApiOperation({ title: 'Get all todos', description: 'Gets all todos with pagination' })
    @ApiImplicitQuery({ name: 'skip', required: false, description: 'Number of todos to skip' })
    @ApiImplicitQuery({ name: 'take', required: false, description: 'Number of todos to take' })
    @ApiResponse({ status: HttpStatus.OK, description: 'A collection of todos', type: TodosPage })
    @Get()
    @HttpCode(HttpStatus.OK)
    async getTodos(
        @Query('skip') skip: number = 0,
        @Query('take') take: number = 10,
        @Query('status') status: TodoStatus|null = null,
        @Query('sortBy') sortBy: TodoSortOrder = TodoSortOrder.ID,
        @Query('direction') sortDirection: SortDirection = SortDirection.ASCENDING): Promise<TodosPage> {

        this.logger.info({skip, take, status, sortBy, sortDirection }, 'get todos');

        const options: FindManyOptions<TodoEntity> = {
            skip,
            take
        };
        if (status !== null) {
            options.where = { status: todoEntityStatusFromTodoStatus(status) };
        }

        let direction: 'ASC'|'DESC';
        if (sortDirection === SortDirection.ASCENDING) {
            direction = 'ASC';
        } else if (sortDirection === SortDirection.DESCENDING) {
            direction = 'DESC';
        } else {
            throw new Error(`Unknown direction ${sortDirection}`);
        }

        if (sortBy === TodoSortOrder.ID) {
            options.order = {
                id: direction
            };
        } else if (sortBy === TodoSortOrder.TEXT) {
            options.order = {
                text: direction,
                id: 'ASC'
            };
        } else if (sortBy === TodoSortOrder.STATUS) {
            options.order = {
                status: direction,
                id: 'ASC'
            };
        } else {
            throw new Error(`Unknown sortBy ${sortBy}`);
        }

        const [todoEntities, count] = await this.todoEntityRepository.findAndCount(options);
        return {
            total: count,
            skip,
            take,
            items: todoEntities.map(todoEntity => todoFromTodoEntity(todoEntity))
        };
    }
}
