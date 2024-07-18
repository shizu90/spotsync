import { IsBoolean, IsBooleanString, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { SortDirection } from "src/common/enums/sort-direction.enum";

export class ListUserAddressesQueryRequest 
{
    @IsOptional()
    @IsString()
    public name?: string;
    
    @IsOptional()
    @IsBooleanString()
    public main?: boolean;
    
    @IsOptional()
    @IsString()
    public sort?: string;
    
    @IsOptional()
    @IsEnum(SortDirection)
    public sort_direction?: SortDirection;
    
    @IsOptional()
    @IsBooleanString()
    public paginate?: boolean;
    
    @IsOptional()
    @IsNumberString()
    public page?: number;
    
    @IsOptional()
    @IsNumberString()
    public limit?: number;
}