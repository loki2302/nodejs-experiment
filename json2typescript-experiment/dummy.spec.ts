import "reflect-metadata";
import {expect} from "chai";
import {JsonConvert, JsonObject, JsonProperty} from "json2typescript";

@JsonObject
class Person {
    @JsonProperty('Id')
    id: number = undefined; // NOTE: 'undefined' is a MUST

    @JsonProperty('Name')
    name: string = undefined; // NOTE: 'undefined' is a MUST

    describe(): string {
        return `Person with id ${this.id} and name ${this.name}`;
    }
}

describe('json2typescript', () => {
    it('should allow me to serialize the UDT', () => {
        const person = new Person();
        person.id = 123;
        person.name = 'John Smith';
        expect(person instanceof Person).to.be.true;

        const jsonConvert = new JsonConvert();

        // NOTE: jsonObject is not a JSON string, but a plain JS object
        const jsonObject = jsonConvert.serialize(person);
        expect(jsonObject instanceof Person).to.be.false;

        expect(jsonObject).to.deep.equal({
            Id: 123,
            Name: 'John Smith'
        });
    });

    it('should allow me to deserialize the UDT', () => {
        const jsonConvert = new JsonConvert();

        // NOTE: a JS object, not a JSON string
        const person = jsonConvert.deserialize({
            Id: 123,
            Name: 'John Smith'
        }, Person);
        console.log(person);
        expect(person instanceof Person).to.be.true;
        expect(person.id).to.equal(123);
        expect(person.name).to.equal('John Smith');
        expect(person.describe()).to.equal('Person with id 123 and name John Smith');
    });
});
