export class JwtDataAdministratorDto{
    toPlainObject(): string | object | Buffer {
        throw new Error("Method not implemented.");
    }
    administratorId:number;
    username:string;
    ext:number;//unix timestamp
    ip:string;
    ua:string;
}