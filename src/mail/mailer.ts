import * as log4js from "log4js";
import * as nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-connection";
import { basename, extname } from "path";

const log = log4js.getLogger(basename(__filename, extname(__filename)));
// log.level = "debug";

// Google as free SMTP https://kinsta.com/knowledgebase/free-smtp-server/
// Enable Less secure app access https://myaccount.google.com/lesssecureapps
//
// {
//     service: "gmail",
//     // secure: true,
//     auth: {
//         user: "pr.rybar@gmail.com",
//         pass: "xxxxxxxxxxx"
//     }
// }
//
// {
//     host: "smtp.gmail.com",
//     port: 465, // SSL
//     // port: 587, // TLS
//     secure: true, // use SSL/TLS
//     auth: {
//         user: "pr.rybar@gmail.com",
//         pass: "xxxxxxxxxxxx"
//     }
// }

export interface MailerConf {
    name: string;
    address: string;
    password: string;
}

export type MailerMessage = nodemailer.SendMailOptions;

export class Mailer {

    private static _instance: Mailer;

    static init(conf: MailerConf): void {
        Mailer._instance = new Mailer(conf);
    }

    static send(message: MailerMessage): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const m = Mailer._instance;
            m.openTransport();
            m.sendMessage(message)
                .then((res) => {
                    resolve(res);
                    m.closeTransport();
                })
                .catch((err) => {
                    reject(err);
                    m.closeTransport();
                });
        });
    }

    private _conf: MailerConf;
    private _transport: nodemailer.Transporter;

    constructor(conf: MailerConf) {
        this._conf = conf;
    }

    openTransport() {
        const options = {
            service: "gmail",
            auth: {
                user: this._conf.address,
                pass: this._conf.password
            }
        };
        log.debug("transport create");
        this._transport = nodemailer.createTransport(options);
    }

    async sendMessage(message: MailerMessage): Promise<SentMessageInfo> {
        const mail = {
            from: `${this._conf.name} <${this._conf.address}>`,
            ...message
        };
        const r = await this._transport.sendMail(mail);
        log.debug("sendMail response", r);
        return r;
    }

    closeTransport() {
        log.debug("transport close");
        this._transport.close();
    }

}
