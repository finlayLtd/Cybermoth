import { NextFunction, Request, Response } from "express";
import expressBasicAuth from "express-basic-auth";
import jwt from "express-jwt";
import * as log4js from "log4js";
import { basename, extname } from "path";
import { ResolveUser } from "../api/authentication";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

export interface AuthBasicOrJwtConf {
    basic: {
        challenge: boolean;
        realm: string;
    };
    jwt: {
        secretOrPublicKey: string;
        algorithms: string[];
        tokenClaimSubject: string;
    };
}

export const authBasicOrJwt = (resolveUser: ResolveUser, conf: AuthBasicOrJwtConf) => {

    let secretOrPublicKey: string;
    let jwtAuth: jwt.RequestHandler;

    const basicAuth = expressBasicAuth({
        challenge: !!conf.basic.challenge,
        realm: conf.basic.realm,
        authorizer: (username, password, cb) => {
            resolveUser(username)
                .then(user => {
                    if (user && (user.password === password)) {
                        cb(null, true);
                    } else {
                        cb(null, false);
                    }
                })
                .catch(err => {
                    log.error(err);
                    cb(null, false);
                });
        },
        authorizeAsync: true
    });

    return async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.headers.authorization;

        if (secretOrPublicKey !== conf.jwt.secretOrPublicKey) {
            log.debug("secretOrPublicKey changed", {
                secretOrPublicKey,
                confSecretOrPublicKey: conf.jwt.secretOrPublicKey
            });
            secretOrPublicKey = conf.jwt.secretOrPublicKey;
            jwtAuth = jwt({ secret: secretOrPublicKey, algorithms: conf.jwt.algorithms });
        }

        if (authorization && authorization.startsWith("Bearer ")) {
            // TODO: Temporary solution
            (req as any).token = authorization.split(" ")[1];
            jwtAuth(req, res, next);
        } else {
            await basicAuth(req, res, next);
        }
    };
};
