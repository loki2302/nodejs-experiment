import "reflect-metadata";
import {expect} from "chai";
import {classToPlain, plainToClass} from "class-transformer";

class Person {
    id: number;
    name: string;

    describe(): string {
        return `Person with id ${this.id} and name ${this.name}`;
    }
}

describe('class-transformer', () => {
    it('should allow me to convert Person to Object', () => {
        const person = new Person();
        person.id = 123;
        person.name = 'John Smith';
        expect(person instanceof Person).to.be.true;

        const jsonObject = classToPlain(person);
        expect(jsonObject instanceof Person).to.be.false;

        expect(jsonObject).to.deep.equal({
            id: 123,
            name: 'John Smith'
        });
    });

    it('should allow me to convert Object to Person', () => {
        const person = plainToClass(Person, {
            id: 123,
            name: 'John Smith'
        });
        expect(person instanceof Person).to.be.true;
        expect(person.id).to.equal(123);
        expect(person.name).to.equal('John Smith');
        expect(person.describe()).to.equal('Person with id 123 and name John Smith');
    });
});
