import { Command } from "src/common/core/common.command";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";

export class CreateSpotFolderCommand extends Command 
{
    constructor(
        readonly name: string,
        readonly description?: string,
        readonly hexColor?: string,
        readonly visibility?: SpotFolderVisibility,
    ) 
    {super();}
}