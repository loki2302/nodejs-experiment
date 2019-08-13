import { Todo } from './Todo';
import { action, observable, runInAction } from 'mobx';
import { AxiosInstance } from 'axios';
import { PutTodoDto, TodoDto } from '../shared/dtos';

export class Store {
    @observable
    public todos: Todo[];

    constructor(private readonly axios: AxiosInstance) {
    }

    @action
    public async loadTodos() {
        const response = await this.axios.get<TodoDto[]>('todos');
        runInAction(() => {
            this.todos = response.data.map(t => ({
                id: t.id,
                text: t.text
            }));
        });
    }

    @action
    public async addTodo(text: string) {
        const id = new Date().toISOString();
        await this.axios.put(`todos/${id}`, {
            text
        } as PutTodoDto);
        await this.loadTodos();
    }

    @action
    public async deleteTodo(id: string) {
        await this.axios.delete(`todos/${id}`);
        await this.loadTodos();
    }
}
