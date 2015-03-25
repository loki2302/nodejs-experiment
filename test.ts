/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/mocha/mocha.d.ts" />

import assert = require('assert');

interface HelloWorlder {
  makeMessage(): string;
}

class HelloWorlderImpl implements HelloWorlder {
  makeMessage(): string {
    return "Hello World!";
  }
}

class Calculator {
  addNumbers(a: number, b: number): number {
    return a + b;
  }
}

describe('Hello Worlder', () => {
  it('should work', () => {
    var helloWorlder: HelloWorlder = new HelloWorlderImpl();
    var message: string = helloWorlder.makeMessage();
    assert.equal(message, 'Hello World!');
  });
});

describe('Calculator', () => {
  it('should add numbers', function() {
    assert.equal(5, new Calculator().addNumbers(2, 3))
  });
});
