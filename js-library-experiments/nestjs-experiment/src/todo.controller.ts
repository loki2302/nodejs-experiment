import { Body, Controller, createParamDecorator, Delete, Get, HttpCode, HttpException, HttpStatus, Param,
    Patch, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDateColumn, FindManyOptions, Repository, UpdateDateColumn } from 'typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino/dist';
import {
    ApiImplicitBody, ApiImplicitParam, ApiImplicitQuery, ApiModelProperty, ApiOAuth2Auth, ApiOperation, ApiResponse,
    ApiUseTags
} from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { TodoEntity, TodoEntityStatus, UserEntity } from './entities';

export const UserId = createParamDecorator((data, req) => {
    return req.res.locals.oauth.token.user.username;
});

export enum TodoStatus {
    NOT_STARTED = 'not-started',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}

export enum TodoSortOrder {
    ID = 'id',
    TEXT = 'text',
    STATUS = 'status',
    CREATED_AT = 'created-at',
    UPDATED_AT = 'updated-at'
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

    @ApiModelProperty({ description: 'Todo created at', type: String, format: 'date-time' })
    createdAt: Date;

    @ApiModelProperty({ description: 'Todo updated at', type: String, format: 'date-time' })
    updatedAt: Date;
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
    const todo = new Todo();
    todo.id = todoEntity.id;
    todo.text = todoEntity.text;
    todo.status = todoStatusFromTodoEntityStatus(todoEntity.status);
    todo.createdAt = todoEntity.createdAt;
    todo.updatedAt = todoEntity.updatedAt;
    return todo;
}

@ApiOAuth2Auth()
@ApiUseTags('todos')
@Controller('todos')
@UsePipes(new ValidationPipe())
export class TodoController {
    constructor(
        @InjectPinoLogger(TodoController.name) private readonly logger: PinoLogger,
        @InjectRepository(TodoEntity) private readonly todoEntityRepository: Repository<TodoEntity>,
        @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>) {
    }

    @ApiOperation({ title: 'Get a todo', description: 'Gets a todo' })
    @ApiImplicitParam({ name: 'id', description: 'Todo ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Found a todo' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No such todo' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getTodo(@Param('id') id: number, @UserId() userId: string): Promise<Todo> {
        const todoEntity = await this.todoEntityRepository.findOne(id, { relations: ['user'] });
        if (todoEntity === undefined) {
            throw new HttpException('no such todo', HttpStatus.NOT_FOUND);
        }

        if (todoEntity.user.username !== userId) {
            throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
        }

        return todoFromTodoEntity(todoEntity);
    }

    @ApiOperation({ title: 'Delete a todo', description: 'Deletes a todo' })
    @ApiImplicitParam({ name: 'id', description: 'Todo ID' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Deleted a todo' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No such todo' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTodo(@Param('id') id: number, @UserId() userId: string): Promise<void> {
        const todoEntity = await this.todoEntityRepository.findOne(id, { relations: ['user'] });
        if (todoEntity === undefined) {
            throw new HttpException('no such todo', HttpStatus.NOT_FOUND);
        }

        if (todoEntity.user.username !== userId) {
            throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
        }

        await this.todoEntityRepository.delete(todoEntity.id);
    }

    @ApiOperation({ title: 'Create or update a todo', description: 'Creates or updates a todo' })
    @ApiImplicitParam({ name: 'id', description: 'Todo ID' })
    @ApiImplicitBody({ name: 'PutTodoBody', type: PutTodoBody, description: 'Todo details' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successfully created or updated a todo' })
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async putTodo(
        @Param('id') id: number,
        @Body() body: PutTodoBody,
        @UserId() userId: string): Promise<void> {

        let todoEntity = await this.todoEntityRepository.findOne(id, { relations: ['user'] });
        if (todoEntity === undefined) {
            todoEntity = new TodoEntity();
            todoEntity.id = id;
            todoEntity.user = await this.userEntityRepository.findOneOrFail(userId);
        } else {
            if (todoEntity.user.username !== userId) {
                throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
            }
        }
        todoEntity.text = body.text;
        todoEntity.status = todoEntityStatusFromTodoStatus(body.status);

        await this.todoEntityRepository.save(todoEntity);
    }

    @ApiOperation({ title: 'Patch a todo', description: 'Patches an existing todo' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successfully patched a todo' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No such todo' })
    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async patchTodo(
        @Param('id') id: number,
        @Body() body: Partial<PutTodoBody>,
        @UserId() userId: string): Promise<void> {

        const todoEntity = await this.todoEntityRepository.findOne(id, { relations: ['user'] });
        if (todoEntity === undefined) {
            throw new HttpException('no such todo', HttpStatus.NOT_FOUND);
        }

        if (todoEntity.user.username !== userId) {
            throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
        }

        if (body.text !== undefined) {
            todoEntity.text = body.text;
        }

        if (body.status !== undefined) {
            todoEntity.status = todoEntityStatusFromTodoStatus(body.status);
        }

        await this.todoEntityRepository.save(todoEntity);
    }

    @ApiOperation({ title: 'Get all todos', description: 'Gets all todos with pagination' })
    @ApiImplicitQuery({ name: 'skip', required: false, description: 'Number of todos to skip' })
    @ApiImplicitQuery({ name: 'take', required: false, description: 'Number of todos to take' })
    @ApiImplicitQuery({ name: 'status', required: false, enum: Object.values(TodoStatus), description: 'Status filter' })
    @ApiImplicitQuery({ name: 'sortBy', required: false, enum: Object.values(TodoSortOrder), description: 'Sort field' })
    @ApiImplicitQuery({ name: 'direction', required: false, enum: Object.values(SortDirection), description: 'Sort direction' })
    @ApiResponse({ status: HttpStatus.OK, description: 'A collection of todos', type: TodosPage })
    @Get()
    @HttpCode(HttpStatus.OK)
    async getTodos(
        @UserId() userId: string,
        @Query('skip') skip: number = 0,
        @Query('take') take: number = 10,
        @Query('status') status: TodoStatus|null = null,
        @Query('sortBy') sortBy: TodoSortOrder = TodoSortOrder.ID,
        @Query('direction') sortDirection: SortDirection = SortDirection.ASCENDING): Promise<TodosPage> {

        const options: FindManyOptions<TodoEntity> = {
            skip,
            take
        };
        if (status !== null) {
            options.where = {
                user: await this.userEntityRepository.findOneOrFail(userId),
                status: todoEntityStatusFromTodoStatus(status)
            };
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
        } else if (sortBy === TodoSortOrder.CREATED_AT) {
            options.order = {
                createdAt: direction,
                id: 'ASC'
            };
        } else if (sortBy === TodoSortOrder.UPDATED_AT) {
            options.order = {
                updatedAt: direction,
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
