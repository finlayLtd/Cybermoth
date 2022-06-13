import * as cors from "cors";
import express, { Application } from "express";
import * as log4js from "log4js";
import path, { basename, extname } from "path";
import { api } from "./api";
import { ResolveApiKey, ResolveUser, UserAuth } from "./api/authentication";
import { Conf } from "./conf";
import { configInit } from "./config";
import { User, UserRole } from "./entity/user";
import { ormInit } from "./orm";
import { UserService } from "./services/user-service";
import { TwilioSms } from "./sms/twiliosms";

const pkg = require(path.resolve(__dirname, "../package.json"));

declare global {
    namespace Express {
        interface Application {
            pkgname: string;
            version: string;
            conf: Conf;
            // logic: Logic;
        }
    }
    interface Request {
        app: Application;
        user: UserAuth | undefined;
    }
}

export const conf = configInit();

log4js.configure(conf.log4js);

const log = log4js.getLogger(basename(__filename, extname(__filename)));

log.info("NODE_ENV", process.env.NODE_ENV || "develop");
log.info("version: %s", pkg.version);
log.info("conf: %s", JSON.stringify(conf, null, 4));

export const app = express();

app.pkgname = pkg.name;
app.version = pkg.version;
app.conf = conf;

ormInit(conf.orm)
    .catch(err => {
        log.error(err);
    })
    .then(async (conn) => {
        // Init admin user
        // User.delete({});
        const userCount = await User.count();
        if (!userCount) {
            await User
                .create({
                    username: "admin",
                    password: "adminpwd",
                    nameFirst: "Admin",
                    nameLast: "",
                    totpVerified: new Date(),
                    email: "email@xyz.com",
                    // phone: "",
                    role: UserRole.admin,
                    customerTitle: "customer",
                    vendorOrderConfirmation: 1,
                    vendorMin: 1,
                    vendorDisclaimer: "text"
                })
                .save();
            const users = await UserService.readAll();
            log.info(users);
        }
    });

// EuroSms.init(conf.eurosms);
TwilioSms.init(conf.twiliosms);

// const resolveUser: ResolveUser = conf.auth.basic.subs
//     ? async (username: string) => conf.auth.basic.subs![username]
//     : async (_: string) => undefined; // NOTE: Custom method. e.g. loading auth from db
const resolveUser: ResolveUser = async (username: string) => {
        const user = await User.findOne({ username });
        if (!user) {
            // const u = conf.auth.basic.subs![username];
            // if (u) {
            //     return u;
            // } else {
            //     return undefined;
            // }
            return undefined;
        }
        // const scopes: string[] = [];
        // if (user.customer) {
        //     scopes.push("customer");
        // }
        // if (user.vendor) {
        //     scopes.push("vendor");
        // }
        return {
            sub: user.id,
            password: user.password,
            scopes: user.role ? [user.role] : [] };
    };
const resolveApiKey: ResolveApiKey = conf.auth.apiKey
    ? async (apiKey: string) => conf.auth.apiKey![apiKey]
    : async (_: string) => undefined; // NOTE: Custom method. e.g. loading auth from db

const apiRouter = api(resolveUser, resolveApiKey, conf);

app.use(cors.default());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", apiRouter);

// Dynamic api loading
// api(app);

// app.get("/", (req, res) => res.redirect("/api"));
