import {expect} from "chai";
import {Subtractor} from "./index";

describe('Subtractor', () => {
    it('should work', () => {
        const subtractor = new Subtractor();
        expect(subtractor.subtract(2, 3)).to.equal(-1);
    });
});
