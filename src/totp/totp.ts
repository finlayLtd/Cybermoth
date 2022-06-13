// import * as log4js from "log4js";
// import { basename, extname } from "path";
import * as speakeasy from "speakeasy";

// const log = log4js.getLogger(basename(__filename, extname(__filename)));
// log.level = "debug";

export interface TotpConf {
}

export class Totp {

    private static readonly _encoding = "base32";

    // private static _instance: Totp;

    // static init(conf: TotpConf): void {
    //     Totp._instance = new Totp(conf);
    // }

    static secret(): string {
        const secret = speakeasy.generateSecret({ length: 20 });
        return secret.base32;
    }

    static token(secret: string): string {
        const token = speakeasy.totp({
          secret,
          encoding: Totp._encoding,
          step: 60
        //   window: 10
        });
        return token;
    }

    static verify(secret: string, token: string): boolean {
        const valid = speakeasy.totp.verify({
            secret,
            encoding: Totp._encoding,
            token,
            step: 60
            // window: 10
        });
        return valid;
    }

    // private _conf: TotpConf;

    // constructor(conf: TotpConf) {
    //     this._conf = conf;
    // }
}
