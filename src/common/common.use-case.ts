import { Command } from "./common.command";

export interface UseCase<I extends Command, O> 
{
    execute(input: I): O;
}