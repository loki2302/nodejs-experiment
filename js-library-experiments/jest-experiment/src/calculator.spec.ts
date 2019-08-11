import {divide} from "./calculator";

describe('calculator', () => {
    it('should divide', () => {
        expect(divide(1, 2)).toBeCloseTo(0.5);
    });

    /*it('should handle division by zero', () => {
        expect(() => divide(1, 0)).toThrow();
    });*/
});
