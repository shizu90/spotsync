export const EncryptPasswordServiceProvider = 'EncryptPasswordService';

export interface EncryptPasswordService 
{
    encrypt(str: string): Promise<string>;
    equals(encryptedStr: string, str: string): Promise<boolean>;
}