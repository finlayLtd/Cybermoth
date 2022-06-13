import { Twilio } from "twilio";

export interface TwilioSmsConf {
    accountSid: string;
    authToken: string;
    twilioNumber: string;
}

export interface TwilioSmsMsg {
    phone: string;
    text: string;
}

export class TwilioSms {

    private static _instance: TwilioSms;

    static init(conf: TwilioSmsConf): void {
        TwilioSms._instance = new TwilioSms(conf);
    }

    static send(msg: TwilioSmsMsg): Promise<any> {
        return TwilioSms._instance.send(msg);
    }

    private _conf: TwilioSmsConf;

    constructor(conf: TwilioSmsConf) {
        this._conf = conf;
    }

    async send(msg: TwilioSmsMsg): Promise<any> {
        const conf = this._conf;

        const client = new Twilio(conf.accountSid, conf.authToken);

        const res = await client.messages
            .create({
                from: conf.twilioNumber,
                to: msg.phone,
                body: msg.text
            });

        return res;
    }
}
