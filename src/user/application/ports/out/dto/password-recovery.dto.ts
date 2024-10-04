import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { PasswordRecoveryStatus } from 'src/user/domain/password-recovery-status.enum';
import { PasswordRecovery } from 'src/user/domain/password-recovery.model';

export class PasswordRecoveryDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public token: string = undefined;
	@ApiProperty({ enum: PasswordRecoveryStatus })
	public status: string = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public created_at: string = undefined;
	@ApiProperty({ example: new Date().toISOString() })
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
		if (model === null || model === undefined) return null;

		return new PasswordRecoveryDto(
			model.id(),
			model.token(),
			model.status(),
			model.createdAt()?.toISOString(),
			model.expiresAt()?.toISOString(),
		);
	}
}
