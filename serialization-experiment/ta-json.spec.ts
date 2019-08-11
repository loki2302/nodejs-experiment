import "reflect-metadata";
import {expect} from "chai";
import {JsonDiscriminatorProperty, JsonDiscriminatorValue, JsonObject, JsonProperty, JSON} from "ta-json";

@JsonObject()
@JsonDiscriminatorProperty('type')
class Animal {
    @JsonProperty()
    type: string;
}

@JsonObject()
@JsonDiscriminatorValue('cat')
class Cat extends Animal {
    constructor() {
        super();
        this.type = 'cat';
    }
}

@JsonObject()
@JsonDiscriminatorValue('dog')
class Dog extends Animal {
    constructor() {
        super();
        this.type = 'dog';
    }
}

describe('ta-json', () => {
    it('should allow me to serialize', () => {
        const animals = [
            new Cat(),
            new Dog()
        ];
        const jsonString = JSON.stringify(animals);
        expect(jsonString).to.equal(`[{"type":"cat"},{"type":"dog"}]`);
    });

    it('should allow me to deserialize', () => {
        const animal1 = JSON.parse<Animal>(`{"type":"cat"}`, Animal);
        expect(animal1 instanceof Cat).to.be.true;

        const animal2 = JSON.parse<Animal>(`{"type":"dog"}`, Animal);
        expect(animal2 instanceof Dog).to.be.true;
    });
});
