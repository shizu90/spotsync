import { IsBooleanString, IsEnum, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";

export class ListGroupMembersQueryRequest 
{
    @IsOptional()
    @IsString()
    public name?: string;
    
    @IsOptional()
    @IsUUID('4')
    public role_id?: string;
    
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