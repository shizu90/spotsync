import { Dto } from "src/common/core/common.dto";
import { PasswordRecovery } from "src/user/domain/password-recovery.model";

export class PasswordRecoveryDto extends Dto {
    public id: string = undefined;
    public token: string = undefined;
    public status: string = undefined;
    public created_at: string = undefined;
    public expires_at: string = undefined;

    constructor(
        id?: string,
        token?: string,
        status?: string,
        created_at?: string,
        expires_at?: string,
    ) {
        super();
        this.id = id;
        this.token = token;
        this.status = status;
        this.created_at = created_at;
        this.expires_at = expires_at;
    }

    public static fromModel(model: PasswordRecovery): PasswordRecoveryDto {
        return new PasswordRecoveryDto(
            model.id(),
            model.token(),
            model.status(),
            model.createdAt()?.toISOString(),
            model.expiresAt()?.toISOString(),
        );
    }
}