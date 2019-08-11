import {expect} from "chai";
import {Adder} from "./index";

describe('Adder', () => {
    it('should work', () => {
        const adder = new Adder();
        expect(adder.add(2, 3)).to.equal(5);
    });
});
