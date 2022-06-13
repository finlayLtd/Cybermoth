import { Configuration } from "log4js";
import { ConnectionOptions } from "typeorm";
import { UserAuth } from "./api/authentication";
import { EuroSmsConf } from "./sms/eurosms";
import { TwilioSmsConf } from "./sms/twiliosms";

export const confDefault = {
    log4js: {
        appenders: { out: { type: "stdout" } },
        categories: { default: { appenders: ["out"], level: "trace" } }
    } as Configuration,
    server: {
        host: "localhost",
        port: 8080
    },
    auth: {
        apiKey: {
            admin_key: { sub: "admin" },
            user_key: { sub: "user", scopes: ["admin", "user"] },
            test_key: { sub: "test", scopes: ["admin"] }
        } as { [api_key: string]: UserAuth } | undefined,
        basic: {
            subs: {
                admin: { password: "adminpwd" },
                user: { password: "userpwd", scopes: ["admin", "user"] },
                test: { password: "testpwd", scopes: ["admin"] }
            },
            challenge: true,
            realm: "api"
        } as {
            subs?: {
                [subject: string]: { password: string; scopes?: string[] };
            };
            challenge: boolean;
            realm: string;
        },
        jwt: {
            secretOrPrivateKey: "TEST",
            secretOrPublicKey: "TEST",
            expiretion: 100,
            algorithms: ["HS256"],
            tokenClaimSubject: "sub",
            tokenClaimScope: "scope"
        }
    },
    orm: {
        username: "root",
        password: "kistls",
        database: "kistl",
        port: 3306,
        synchronize: true,
        logging: true,
        bigNumberStrings: false
    } as ConnectionOptions,
    // mailer: {
    //     name: "Kistl Info",
    //     address: "info@kistl.at",
    //     password: "Kistl#132"
    // } as MailerConf
    eurosms: {
        url: "https://as.eurosms.com/api/v3/test/one", // https://as.eurosms.com/api/v3/send/one
        iid: "",
        ikey: "",
        opts: {
            flgs: 3,
            ttl: 600
        }
    } as EuroSmsConf,
    twiliosms: {
        accountSid: "AC8a1429f95bb705cc34459ffa183d4f6f",
        authToken: "fb852574775c44f802722c5a7e0c7807",
        twilioNumber: "+17405247341"
    } as TwilioSmsConf
};

export type Conf = typeof confDefault;
