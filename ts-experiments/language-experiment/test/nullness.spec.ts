import {expect} from 'chai';
import { writeFileSync, unlinkSync } from 'fs';
import * as ts from 'typescript';

class Compiler {
    constructor(private readonly compilerOptions: Partial<ts.CompilerOptions>) {
    }

    compile(code: string): string[] {
        const fileNameTs = '1.ts';
        const fileNameJs = '1.js';
        writeFileSync(fileNameTs, code);

        try {
            const program = ts.createProgram([fileNameTs], {
                ...this.compilerOptions,
                typeRoots: [],
                types: []
            });

            const emitResult = program.emit();
            const diagnostics = [
                ...ts.getPreEmitDiagnostics(program),
                ...emitResult.diagnostics
            ];
            return diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
        } finally {
            unlinkSync(fileNameTs);
            unlinkSync(fileNameJs);
        }
    }
}

describe('Null checks', () => {
    describe('strictNullChecks: false', () => {
        const compiler = new Compiler({
            strictNullChecks: false
        });

        it('should allow null for string values', () => {
            const messages = compiler.compile(`
                const x: string = null;
            `);
            expect(messages).to.be.empty;
        });

        it('should allow null for string function parameters', () => {
            const messages = compiler.compile(`
                function f(x: string) {}
                f(null);
            `);
            expect(messages).to.be.empty;
        });
    });

    describe('strictNullChecks: true', () => {
        const compiler = new Compiler({
            strictNullChecks: true
        });

        it('should not allow null for string values', () => {
            const messages = compiler.compile(`
                const x: string = null;
            `);
            expect(messages).to.deep.equal([
                "Type 'null' is not assignable to type 'string'."
            ]);
        });

        it('should not allow null for string function parameters', () => {
            const messages = compiler.compile(`
                function f(x: string) {}
                f(null);
            `);
            expect(messages).to.deep.equal([
                "Argument of type 'null' is not assignable to parameter of type 'string'."
            ]);
        });
    });
});
