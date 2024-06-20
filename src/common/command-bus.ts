import { Command } from "./common.command";
import { UseCase } from "./common.use-case";

export class CommandBus 
{
    private useCases = new Map();

    public register(command: Function, useCase: UseCase<any, any>): void 
    {
        this.useCases.set(command, useCase);
    }

    public execute(command: Command): void 
    {
        const useCase = this.useCases.get(command.constructor);
        
        if(useCase) {
            useCase.execute(command);
        }
    }
}