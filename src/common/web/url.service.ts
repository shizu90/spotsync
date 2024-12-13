import * as crypto from 'crypto';

export class URLService {
    private baseURL: string = process.env.APP_URL + '/' + process.env.APP_PREFIX;
    private signatureSecretKey: string = process.env.URL_SIGNATURE_SECRET_KEY;

    public getBaseURL(): string {
        return this.baseURL;
    }

    private generateSignature(url: string): string {
        const signature = crypto
            .createHmac('sha256', this.signatureSecretKey)
            .update(url)
            .digest('hex');

        return signature;
    }

    private replaceParams(url: string, params: Record<string, string>): string {
        let u = url;
        
        for (const key in params) {
            if (u.includes(key)) {
                u = u.replace(`{${key}}`, params[key]);
            }
        }

        return u;
    }

    public generateSignedURL(path: string, params: Record<string, string>): string {
        let url = this.baseURL;

        if (path.startsWith('/')) {
            url += path;
        } else {
            url += `/${path}`;
        }

        for (const key in params) {
            if (url.includes(key)) {
                url = url.replace(`{${key}}`, params[key]);
            }
        }

        url = this.replaceParams(url, params);

        const signature = this.generateSignature(url);

        const urlObject = new URL(url);

        urlObject.searchParams.append('signature', signature);

        return urlObject.toString();
    }

    public generateTemporarySignedURL(path: string, params: Record<string, string>, expiration: number): string {
        let url = this.baseURL;

        if (path.startsWith('/')) {
            url += path;
        } else {
            url += `/${path}`;
        }

        url = this.replaceParams(url, params);

        const expireMillis = Date.now() + expiration;

        url += `?expires=${expireMillis}`;

        const signature = this.generateSignature(url);

        const urlObject = new URL(url);

        urlObject.searchParams.append('signature', signature);

        return urlObject.toString();
    }

    public verifySignedURL(url: string): boolean {
        const urlObject = new URL(url);
        const signature = urlObject.searchParams.get('signature');

        if (!signature) {
            return false;
        }

        urlObject.searchParams.delete('signature');

        const urlWithoutSignature = urlObject.toString();

        const expectedSignature = this.generateSignature(urlWithoutSignature);

        return signature === expectedSignature;
    }
}