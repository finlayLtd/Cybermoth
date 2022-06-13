import basicAuth from "basic-auth";
import { Request as Req } from "express";
import jwt from "jsonwebtoken";
import * as log4js from "log4js";
import { basename, extname } from "path";
import { Conf } from "../conf";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

export interface UserAuth {
    sub: string;
    scopes?: string[];
}

export type ResolveUser = (username: string) => Promise<{ sub: string; password: string; scopes?: string[]; } | undefined>;
export type ResolveApiKey = (apiKey: string) => Promise<{ sub: string; scopes?: string[]; } | undefined>;

let _confAuth: Conf["auth"];
let _resolveUser: ResolveUser;
let _resolveApiKey: ResolveApiKey;

export function initAuthentication(conf: Conf["auth"], resolveUser: ResolveUser, resolveApiKey: ResolveApiKey): void {
    _confAuth = conf;
    _resolveUser = resolveUser;
    _resolveApiKey = resolveApiKey;
}

export async function expressAuthentication(req: Req, securityName: string, scopes?: string[]): Promise<any> {
    log.debug("TSOA expressAuthentication:", securityName, scopes);
    switch (securityName) {

        case "api_key": {
            const apiKey = (req.query && req.query.api_key) || req.headers["x-api-key"];
            if (typeof apiKey === "string") {
                const user = await _resolveApiKey(apiKey);
                if (user) {
                    // NOTE: Admin subjects have no scopes = []
                    const subScopes: string[] = user.scopes ?? [];
                    if (scopes && subScopes.length) {
                        for (const scope of scopes) {
                            if (!subScopes.includes(scope)) {
                                const msg = "API Key does not have required scope";
                                log.warn("Authentication:", securityName, user, msg, scope);
                                return Promise.reject(new Error(msg));
                            }
                        }
                    }
                    const userAuth: UserAuth = {
                        sub: user.sub,
                        scopes: user.scopes
                    };
                    log.info("Authentication:", securityName, userAuth, user);
                    return Promise.resolve(userAuth);
                } else {
                    const msg = "Invalid API Key";
                    log.warn("Authentication:", securityName, msg, user);
                    return Promise.reject(new Error(msg));
                }
            } else {
                const msg = "Malformed API Key";
                log.debug("Authentication:", securityName, msg);
                return Promise.reject(new Error(msg));
            }
        }

        case "basic_auth": {
            const auth = basicAuth(req);
            if (auth) {
                const user = await _resolveUser(auth.name);
                // log.debug("Authentication: user", user);
                if (user && (auth.pass === user.password)) {
                    // NOTE: Admin subjects have no scopes = []
                    const subScopes: string[] = user.scopes ?? [];
                    if (subScopes && subScopes.length) {
                        for (const scope of subScopes) {
                            if (!subScopes.includes(scope)) {
                                const msg = "User does not have required scope";
                                log.warn("Authentication:", securityName, auth, msg, scope, subScopes);
                                return Promise.reject(new Error(msg));
                            }
                        }
                    }
                    const userAuth: UserAuth = {
                        sub: user.sub,
                        scopes: subScopes
                    };
                    log.info("Authentication:", securityName, userAuth, auth);
                    return Promise.resolve(userAuth);
                } else {
                    const msg = "Invalid basic auth credentials";
                    log.warn("Authentication:", securityName);
                    return Promise.reject(new Error(msg));
                }
            } else {
                const msg = "No basic auth credentials";
                log.debug("Authentication:", securityName, msg, auth);
                return Promise.reject(new Error(msg));
            }
        }

        case "jwt": {
            const token = parseBearerToken(req) || req.headers["x-access-token"] || req.query.token || req.body.token;
            if (token) {
                return new Promise<any>((resolve, reject) => {
                    jwt.verify(token, _confAuth.jwt.secretOrPublicKey, (err: any, decoded: any) => {
                        if (err) {
                            log.warn("Authentication:", securityName, err.message);
                            return reject(err);
                        } else {
                            const subScopes = decoded[_confAuth.jwt.tokenClaimScope];
                            if (scopes) {
                                if (subScopes) {
                                    for (const scope of scopes) {
                                        if (!subScopes.includes(scope)) {
                                            const msg = "JWT does not contain required scope";
                                            log.warn("Authentication:", securityName, msg);
                                            return reject(new Error(msg));
                                        }
                                    }
                                }
                                // ELSE: Admin subjects have no scopes = ""
                            }
                            const userAuth: UserAuth = {
                                sub: decoded[_confAuth.jwt.tokenClaimSubject],
                                scopes: subScopes
                            };
                            log.info("Authentication:", securityName, userAuth, decoded);
                            return resolve(userAuth);
                        }
                    });
                });
            } else {
                const msg = "No JWT token";
                log.debug("Authentication:", securityName, msg);
                return Promise.reject(new Error(msg));
            }
        }

        default: {
            const msg = `Unsupported authentication: ${securityName}`;
            log.debug("Authentication:", securityName, msg);
            return Promise.reject(new Error(msg));
        }
    }
}

function parseBearerToken(req: Req): string | undefined {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
    return undefined;
}
