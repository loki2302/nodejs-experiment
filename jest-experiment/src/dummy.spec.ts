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
