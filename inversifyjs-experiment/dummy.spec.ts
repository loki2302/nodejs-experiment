import "reflect-metadata";
import { expect } from "chai";
import {injectable, inject, Container} from "inversify";

describe('inversifyjs', () => {
    const TYPES = {
        AddService: Symbol("AddService"),
        SubService: Symbol("SubService"),
        Calculator: Symbol("Calculator")
    };

    interface Calculator {
        addNumbers(a: number, b: number): number;
        subNumbers(a: number, b: number): number;
    }

    @injectable()
    class AddService {
        add(a: number, b: number): number {
            return a + b;
        }
    }

    @injectable()
    class SubService {
        sub(a: number, b: number): number {
            return a - b;
        }
    }

    @injectable()
    class CalculatorImpl implements Calculator {
        constructor(
            @inject(TYPES.AddService) private addService: AddService,
            @inject(TYPES.SubService) private subService: SubService) {
        }

        addNumbers(a: number, b: number): number {
            return this.addService.add(a, b);
        }

        subNumbers(a: number, b: number): number {
            return this.subService.sub(a, b);
        }
    }

    it('should work', () => {
        const container = new Container();
        container.bind<AddService>(TYPES.AddService).to(AddService);
        container.bind<SubService>(TYPES.SubService).to(SubService);
        container.bind<Calculator>(TYPES.Calculator).to(CalculatorImpl);

        const calculator = container.get<Calculator>(TYPES.Calculator);
        const twoPlus3 = calculator.addNumbers(2, 3);
        const result = calculator.subNumbers(twoPlus3, 9);
        expect(result).to.equal(-4);
    });
});
