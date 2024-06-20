export const EncryptPasswordServiceProvider = 'EncryptPasswordService';

export interface EncryptPasswordService 
{
    encrypt(str: string): string;
    equals(encryptedStr: string, str: string): boolean;
}