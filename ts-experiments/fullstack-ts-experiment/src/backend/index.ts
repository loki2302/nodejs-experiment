import * as express from 'express';
import * as path from 'path';
import { PutTodoDto, TodoDto } from '../shared/dtos';

const app = express();

app.use(express.static(path.join(__dirname, '../../dist')));
app.use(express.json());

let todos: TodoDto[] = [
    { id: '1', text: 'Get some milk' },
    { id: '2', text: 'Get some coffee' },
    { id: '3', text: 'Get some life' }
];

app.get('/api/todos', (req, res) => {
    res.status(200).send(todos);
});

app.put('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    let todo = todos.find(t => t.id === id);
    if (todo === undefined) {
        todo = { id, text: (req.body as PutTodoDto).text };
        todos.push(todo);
    } else {
        todo.text = (req.body as PutTodoDto).text;
    }
    res.status(204).send();
});

app.delete('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    todos = todos.filter(t => t.id !== id);
    res.status(204).send();
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
