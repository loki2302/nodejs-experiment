import { observer } from 'mobx-react';
import * as React from 'react';
import { TodoComponent } from './TodoComponent';
import { Store } from './Store';
import { FormEvent } from 'react';
import { makeMessage } from '../shared/message';

export interface TodoAppProps {
    store: Store;
}

@observer
export class TodoAppComponent extends React.Component<TodoAppProps> {
    private readonly newTodoTextRef = React.createRef<HTMLInputElement>();

    public componentDidMount(): void {
        this.props.store.loadTodos();
    }

    public render(): any {
        if (this.props.store.todos === undefined) {
            return (<p>Loading...</p>);
        }

        return (
            <div>
                <h1>Todo App ({this.props.store.todos.length} todos)</h1>
                <p>Message: {makeMessage()}</p>
                <form onSubmit={e => this.addTodo(e)}>
                    <input type='text' ref={this.newTodoTextRef} />
                    <button type='submit'>Add</button>
                </form>
                <ul>
                    {this.props.store.todos.map(todo => (
                        <li key={todo.id}>
                            <TodoComponent todo={todo} delete={() => this.deleteTodo(todo.id)}/>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    private addTodo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const text = this.newTodoTextRef.current.value;
        this.props.store.addTodo(text);
        this.newTodoTextRef.current.value = '';
    }

    private deleteTodo(id: string) {
        this.props.store.deleteTodo(id);
    }
}
