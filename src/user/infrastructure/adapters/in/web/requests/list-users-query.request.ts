import { IsBoolean, IsBooleanString, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";

export class ListUsersQueryRequest 
{
    @IsOptional()
    @IsString()
    public name?: string;
    
    @IsOptional()
    @IsString()
    public sort?: string;
    
    @IsOptional()
    @IsEnum(SortDirection)
    public sort_direction?: 'asc' | 'desc';
    
    @IsOptional()
    @IsNumberString()
    public page?: number;
    
    @IsOptional()
    @IsBooleanString()
    public paginate?: boolean;
    
    @IsOptional()
    @IsNumberString()
    public limit?: number;
}