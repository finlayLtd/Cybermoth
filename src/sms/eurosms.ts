import * as request from "request";

const HmacSha1 = require("hmac_sha1");

export interface EuroSmsConf {
    url: string;
    iid: string;
    ikey: string;
    opts?: {
        flgs: number;
        ttl: number;
    };
}

export interface EuroSmsMsg {
    sndr: string;
    rcpt: string;
    txt: string;
}

export class EuroSms {

    private static _instance: EuroSms;

    static init(conf: EuroSmsConf): void {
        EuroSms._instance = new EuroSms(conf);
    }

    static send(msg: EuroSmsMsg): Promise<any> {
        return EuroSms._instance.send(msg);
    }

    private _conf: EuroSmsConf;
    private _hmacSha1: any;

    constructor(conf: EuroSmsConf) {
        this._conf = conf;
        this._hmacSha1 = new HmacSha1();
    }

    send(msg: EuroSmsMsg): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            request.post(
                this._conf.url,
                {
                    json: {
                        iid: this._conf.iid,
                        sndr: msg.sndr,
                        rcpt: msg.rcpt,
                        txt: msg.txt,
                        sgn: this._hmacSha1.digest(
                            this._conf.ikey,
                            `${msg.sndr}${msg.rcpt}${msg.txt}`),
                        ...this._conf.opts
                    }
                },
                (err, res, body) => err
                    ? reject(err)
                    : resolve(body));
        });
    }
}
