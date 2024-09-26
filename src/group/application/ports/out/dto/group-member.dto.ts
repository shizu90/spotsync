import { Dto } from "src/common/core/common.dto";
import { GroupMember } from "src/group/domain/group-member.model";
import { UserDto } from "src/user/application/ports/out/dto/user.dto";
import { GroupRoleDto } from "./group-role.dto";

export class GroupMemberDto extends Dto {
    public id: string = undefined;
    public user: UserDto = undefined;
    public role: GroupRoleDto = undefined;
    public joined_at: string = undefined;
    public requested_at: string = undefined;
    public is_creator: boolean = undefined;

    private constructor(
        id?: string,
        user?: UserDto,
        role?: GroupRoleDto,
        joined_at?: string,
        requested_at?: string,
        is_creator?: boolean,
    ) {
        super();
        this.id = id;
        this.user = user;
        this.role = role;
        this.joined_at = joined_at;
        this.requested_at = requested_at;
        this.is_creator = is_creator;
    }

    public static fromModel(model: GroupMember): GroupMemberDto {
        return new GroupMemberDto(
            model.id(),
            UserDto.fromModel(model.user()).removeSensitiveData(),
            GroupRoleDto.fromModel(model.role()),
            model.joinedAt().toISOString(),
            model.requestedAt()?.toISOString(),
            model.isCreator(),
        );
    }
}