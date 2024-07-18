import {
  IsBooleanString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListGroupRolesQueryRequest {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsBooleanString()
  public is_immutable?: boolean;

  @IsOptional()
  @IsString()
  public sort?: string;

  @IsOptional()
  @IsEnum(SortDirection)
  public sort_direction?: SortDirection;

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
