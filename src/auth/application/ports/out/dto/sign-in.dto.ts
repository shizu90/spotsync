import { Dto } from 'src/common/common.dto';

export class SignInDto extends Dto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly bearer_token: string,
  ) {
    super();
  }
}
