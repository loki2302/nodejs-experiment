import {expect} from 'chai';

interface Command<TResult> {
}

class AddNumbersCommand implements Command<number> {
    constructor(public a: number, public b: number) {}
}

class SubtractNumbersCommand implements Command<number> {
    constructor(public a: number, public b: number) {}
}

class DummyCommand implements Command<void> {
}

interface CommandHandler<TResult> {
    readonly commandType: Function;
    handle(command: Command<TResult>): TResult;
}

class AddNumbersCommandHandler implements CommandHandler<number> {
    commandType = AddNumbersCommand;

    handle(command: AddNumbersCommand): number {
        return command.a + command.b;
    }
}

class SubtractNumbersCommandHandler implements CommandHandler<number> {
    commandType = SubtractNumbersCommand;

    handle(command: SubtractNumbersCommand): number {
        return command.a - command.b;
    }
}

class NoCommandHandlerError extends Error {
    constructor(constructorFunction: Function) {
        super(`There's no command handler for command of type ${constructorFunction.name}`);
        Object.setPrototypeOf(this, NoCommandHandlerError.prototype);
    }
}

class CommandService {
    private commandHandlersByCommandTypes: Map<Function, CommandHandler> = new Map();

    constructor(commandHandlers: CommandHandler[]) {
        commandHandlers.forEach(commandHandler => {
            this.commandHandlersByCommandTypes.set(commandHandler.commandType, commandHandler);
        });
    }

    handleCommand<TResult>(command: Command<TResult>): TResult {
        const commandHandler = this.commandHandlersByCommandTypes.get(command.constructor);
        if(!commandHandler) {
            throw new NoCommandHandlerError(command.constructor);
        }

        return commandHandler.handle(command);
    }
}

describe('CommandService', () => {
    it('should work', () => {
        const commandService = new CommandService([
            new AddNumbersCommandHandler(),
            new SubtractNumbersCommandHandler()
        ]);

        const addNumbersCommand = new AddNumbersCommand(2, 3);
        expect(commandService.handleCommand(addNumbersCommand)).to.equal(5);

        const subtractNumbersCommand = new SubtractNumbersCommand(2, 3);
        expect(commandService.handleCommand(subtractNumbersCommand)).to.equal(-1);

        expect(() => commandService.handleCommand(new DummyCommand())).to.throw(NoCommandHandlerError);
    });
});
