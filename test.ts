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

describe('Hello Worlder', () => {
  it('should work', () => {
    var helloWorlder: HelloWorlder = new HelloWorlderImpl();
    var message: string = helloWorlder.makeMessage();
    assert.equal(message, 'Hello World!');
  });  
});
