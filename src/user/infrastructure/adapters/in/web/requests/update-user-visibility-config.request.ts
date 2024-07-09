import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { UserVisibility } from "src/user/domain/user-visibility.enum";

export class UpdateUserVisibilityConfigRequest 
{
    @ApiProperty({required: false})
    @IsEnum(UserVisibility)
    @IsOptional()
    public profile_visibility?: UserVisibility;

    @ApiProperty({required: false})
    @IsEnum(UserVisibility)
    @IsOptional()
    public address_visibility?: UserVisibility;

    @ApiProperty({required: false})
    @IsEnum(UserVisibility)
    @IsOptional()
    public poi_folder_visibility?: UserVisibility;

    @ApiProperty({required: false})
    @IsEnum(UserVisibility)
    @IsOptional()
    public visited_poi_visibility?: UserVisibility;

    @ApiProperty({required: false})
    @IsEnum(UserVisibility)
    @IsOptional()
    public post_visibility?: UserVisibility;
}