const istanbul = require('istanbul');
const instrumenter = new istanbul.Instrumenter();
const vm = require('vm');
const util = require('util');

const libCode = `
function doSomething() {
    return 'hello';
}

function doSomethingElse() {
    return 'bye';
}
`;

const instrumentedLibCode = instrumenter.instrumentSync(libCode, 'dummy.js');
console.log('Instrumented code:', instrumentedLibCode);

const sandbox = {};
const context = new vm.createContext(sandbox);

const libScript = new vm.Script(instrumentedLibCode);
libScript.runInContext(context);

if(true) {
    console.log('TEST1 - doSomething()');

    const testCode = `
doSomething();
`;
    const testScript = new vm.Script(testCode);
    testScript.runInContext(context);

    console.log('Coverage object:', util.inspect(sandbox.__coverage__, {depth: null, colors: true}));

    const collector = new istanbul.Collector();
    collector.add(sandbox.__coverage__);

    const reporter = new istanbul.Reporter();
    reporter.add('text');

    reporter.write(collector, true, () => {
        console.log('Done!');
    });
}

if(true) {
    console.log('TEST2 - doSomethingElse()');

    const testCode = `
doSomethingElse();
`;
    const testScript = new vm.Script(testCode);
    testScript.runInContext(context);

    console.log('Coverage object:', util.inspect(sandbox.__coverage__, {depth: null, colors: true}));

    const collector = new istanbul.Collector();
    collector.add(sandbox.__coverage__);

    const reporter = new istanbul.Reporter();
    reporter.add('text');

    reporter.write(collector, true, () => {
        console.log('Done!');
    });
}
