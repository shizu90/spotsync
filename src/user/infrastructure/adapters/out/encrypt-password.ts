import { Injectable } from '@nestjs/common';
import { EncryptPasswordService } from 'src/user/application/ports/out/encrypt-password.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptPasswordServiceImpl implements EncryptPasswordService {
  private _salt = 10;

  public async encrypt(str: string): Promise<string> {
    return await bcrypt.hash(str, this._salt);
  }

  public async equals(encryptedStr: string, str: string): Promise<boolean> {
    return await bcrypt.compare(str, encryptedStr);
  }
}
