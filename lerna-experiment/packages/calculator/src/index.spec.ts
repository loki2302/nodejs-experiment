import {expect} from "chai";
import {Calculator} from "./index";

describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    it('should addNumbers numbers', () => {
        expect(calculator.addNumbers(2, 3)).to.equal(5);
    });

    it('should subtract numbers', () => {
        expect(calculator.subtractNumbers(2, 3)).to.equal(-1);
    });
});
