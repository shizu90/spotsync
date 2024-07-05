import { Injectable } from "@nestjs/common";
import { EncryptPasswordService } from "src/user/application/ports/out/encrypt-password.service";

@Injectable()
export class EncryptPasswordServiceImpl implements EncryptPasswordService 
{
    public encrypt(str: string): string {
        return str;
    }

    public equals(encryptedStr: string, str: string): boolean {
        return encryptedStr === str;
    }
}