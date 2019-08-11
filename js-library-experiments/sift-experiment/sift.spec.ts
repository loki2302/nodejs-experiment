import {expect} from 'chai';
import sift, {SiftQuery} from 'sift';

interface Todo {
    id: number;
    text: string;
}

describe('sift', () => {
    const todos: Todo[] = [
        { id: 1, text: 'get some coffee' },
        { id: 2, text: 'get some milk' },
        { id: 3, text: 'drink it' }
    ];

    it('should let me search by exact value', () => {
        const results = sift(<SiftQuery<Todo[]>>{
            id: { $eq: 1 }
            }, todos);
        expect(results.length).to.equal(1);
        expect(results[0]).to.equal(todos[0]);
    });

    it('should let me search by field contains', () => {
        const results = sift(<SiftQuery<Todo[]>>{
            text: { $regex: /get/ }
            }, todos);
        expect(results.length).to.equal(2);
        expect(results[0]).to.equal(todos[0]);
        expect(results[1]).to.equal(todos[1]);
    })
});
