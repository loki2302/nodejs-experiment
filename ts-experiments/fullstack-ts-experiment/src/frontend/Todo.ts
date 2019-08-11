import { observable } from 'mobx';

export class Todo {
    public id: string;
    @observable public text: string;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
    }
}
