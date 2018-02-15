export function divide(a: number, b: number): number {
    if(b == 0) {
        throw new Error('You should not divide by zero');
    }
    return a / b;
}
