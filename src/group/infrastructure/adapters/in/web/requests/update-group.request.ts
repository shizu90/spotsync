import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateGroupRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Group name is invalid.' })
  @MinLength(6, { message: 'Group name must have at least 6 characters.' })
  @MaxLength(255, { message: 'Group name must have less than 255 characters.' })
  public name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Group about is invalid.' })
  @MaxLength(400, {
    message: 'Group about must have less than 400 characters.',
  })
  public about?: string;
}
