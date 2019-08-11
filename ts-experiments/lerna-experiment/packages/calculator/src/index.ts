import {Adder} from "adder";
import {Subtractor} from "subtractor";

export class Calculator {
    private adder = new Adder();
    private subtractor = new Subtractor();

    addNumbers(a: number, b: number): number {
        return this.adder.add(a, b);
    }

    subtractNumbers(a: number, b: number): number {
        return this.subtractor.subtract(a, b);
    }
}
