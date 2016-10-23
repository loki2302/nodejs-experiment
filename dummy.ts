/**
 * Provides functionality to add an subtract numbers.
 */
class Calculator {
    /**
     * Add two numbers.
     * @param a first number to add
     * @param b second number to add
     * @returns {number} a sum of A and B
     */
    add(a: number, b: number): number {
        return a + b;
    }

    /**
     * Subtract two numbers.
     * @param a number to subtract from
     * @param b number to subtract
     * @returns {number} a difference of A and B
     */
    subtract(a: number, b: number): number {
        return a - b;
    }
}

/**
 * Provides functionality to say "hello world".
 */
class HelloWorlder {
    /**
     *
     * @param name a name of someone to say "hello" to
     */
    constructor(private name: string) {
    }

    /**
     * Say "hello world".
     */
    sayIt(): void {
        console.log(`hello ${this.name}`);
    }
}
