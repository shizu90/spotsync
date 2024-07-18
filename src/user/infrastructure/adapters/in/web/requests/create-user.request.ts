import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserRequest {
  @ApiProperty()
  @IsString({ message: 'User name is invalid.' })
  @MinLength(3, { message: 'User name must have at least 3 characters.' })
  @MaxLength(255, { message: 'User name must have less than 255 characters.' })
  public name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail is invalid.' })
  public email: string;

  @ApiProperty()
  @IsString({ message: 'Password is invalid.' })
  @MinLength(6, { message: 'Password must have at least 6 characters.' })
  @MaxLength(32, { message: 'Password must have less than 32 characters.' })
  public password: string;

  @ApiProperty()
  @IsDateString(
    { strict: false, strictSeparator: false },
    { message: 'Birth date is invalid' },
  )
  public birth_date: Date;
}
