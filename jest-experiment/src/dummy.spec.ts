describe('something', () => {
    beforeEach(() => {
        console.log('before each!');
    });

    afterEach(() => {
        console.log('after each!');
    });

    it('should work', () => {
        expect(2 + 3).toBe(5);
    });
});

test('it should work', () => {
    expect('a' + 'b').toBe('ab');
});

describe('promises', () => {
    it('should work', async () => {
        await new Promise((resolve) => {
            setTimeout(resolve, 10);
        });
        expect(1).toBeGreaterThan(0);
    });
});

describe('mocks', () => {
    it('should work', () => {
        const doSomething = jest.fn();
        doSomething(2, 'hello');
        expect(doSomething).toHaveBeenCalled();

        const call = doSomething.mock.calls[0];
        expect(call).toEqual([2, 'hello']);
    });
});
