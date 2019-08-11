import { Todo } from './Todo';
import { action, observable } from 'mobx';

export class Store {
    @observable
    public todos: Todo[];

    @action
    public loadTodos() {
        this.todos = [
            new Todo('todo1', 'hello there'),
            new Todo('todo2', 'todo #2'),
            new Todo('todo3', 'todo #3')
        ];
    }

    @action
    public addTodo(text: string) {
        this.todos.push(new Todo(new Date().toISOString(), text));
    }

    @action
    public deleteTodo(id: string) {
        this.todos = this.todos.filter(todo => todo.id !== id);
    }
}
