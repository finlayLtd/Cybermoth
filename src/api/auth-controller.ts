import { JwtPayload, sign, verify } from "jsonwebtoken";
import * as log4js from "log4js";
import { basename, extname } from "path";
import { tmplo } from "peryl/dist/tmpl";
import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    Route,
    Security,
    Tags
} from "tsoa";
import { User, UserRole } from "../entity/user";
import { UserService } from "../services/user-service";
import { TwilioSms } from "../sms/twiliosms";
import { Totp } from "../totp/totp";
import { UserAuth } from "./authentication";
import { ApiResponse } from "./common";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

interface AuthLogin {
    username: string;
    password: string;
    /** Expiration time in seconds*/
    exp?: number;
}

interface AuthJwt {
    jwt: string;
}

interface AuthJwtExp {
    jwt: string;
    /** Expiration time in seconds*/
    exp?: number;
}

interface AuthJwtResponse extends ApiResponse {
    jwt?: string;
    payload?: AuthJwtResPayload;
}

interface AuthJwtResPayload {
    [key: string]: any;
}

interface AuthTotpTokenRequest {
    /** Phone number in format +421903542289 */
    phone: string;
    /** template string, example "My SMS code: ${token}" */
    text: string;
}

interface AuthTotpTokenResponse extends ApiResponse {
    success?: string;
}

interface AuthTotpVerifyRequest {
    /** Phone number in format +421903542289 */
    phone: string;
    token: string;
    /** Expiration time in seconds*/
    exp?: number;
}

interface AuthTotpVerifyResponse extends ApiResponse {
    jwt?: string;
}

interface AuthSms {
    phone: string;
    text: string;
}

interface AuthSmsResponse extends ApiResponse {
    response?: string;
}

@Route("/auth")
@Tags("Auth")
export class AuthController extends Controller {
    @Get("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async auth(@Request() req: Request): Promise<UserAuth> {
        log.info("Auth:", req.user);
        return req.user;
    }

    @Post("/login")
    async authLogin(
        @Request() req: Request,
        @Body() login: AuthLogin
    ): Promise<AuthJwtResponse> {
        log.info("Login:", login);
        try {
            const user = await UserService.readByUsernameAndPassword(
                login.username,
                login.password
            );
            const payload = {
                sub: user.id,
                iss: req.app.pkgname,
                iat: Math.floor(Date.now() / 1000),
                exp:
                    Math.floor(Date.now() / 1000) +
                    (login.exp || req.app.conf.auth.jwt.expiretion),
                ren: 0
            };
            const jwt = sign(payload, req.app.conf.auth.jwt.secretOrPrivateKey);
            log.debug("JWT:", jwt, payload);
            return { jwt, payload };
        } catch (error) {
            log.warn(error);
            return { error: String(error) };
        }
    }

    @Post("/jwt/renew")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async authJwtRenew(
        @Request() req: Request,
        @Body() authJwtExp: AuthJwtExp
    ): Promise<AuthJwtResponse> {
        log.info("User logged:", req.user);
        try {
            const payload = verify(
                authJwtExp.jwt,
                req.app.conf.auth.jwt.secretOrPublicKey
            ) as JwtPayload;
            log.debug("JWT renew verified:", payload);
            const payloadNew = {
                ...payload,
                iat: Math.floor(Date.now() / 1000),
                exp:
                    Math.floor(Date.now() / 1000) +
                    (authJwtExp.exp || req.app.conf.auth.jwt.expiretion),
                ren: payload.ren ? ++payload.ren : 1
            };
            const jwtNew = sign(
                payloadNew,
                req.app.conf.auth.jwt.secretOrPrivateKey
            );
            log.debug("JWT renewed:", jwtNew, payloadNew);
            return { jwt: jwtNew, payload: payloadNew };
        } catch (err) {
            log.warn("JWT renew verify error:", err);
            return { error: String(err) };
        }
    }

    @Post("/jwt/verify")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async authJwtVerify(
        @Request() req: Request,
        @Body() authJwt: AuthJwt
    ): Promise<AuthJwtResponse> {
        log.info("User logged:", req.user);
        try {
            const payload = verify(
                authJwt.jwt,
                req.app.conf.auth.jwt.secretOrPublicKey
            ) as JwtPayload;
            log.debug("JWT verified:", payload);
            return { jwt: authJwt.jwt, payload };
        } catch (err) {
            log.warn("JWT renew verify error:", err);
            return { error: String(err) };
        }
    }

    @Post("/totp/register")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async authTotpRegister(
        @Body() tokenReq: AuthTotpTokenRequest
    ): Promise<AuthTotpTokenResponse> {
        log.info("TOTP register:", tokenReq);

        const user = await User.findOne({ phone: tokenReq.phone });

        if (user) {
            return { error: "User already exists" };
        } else {
            try {
                const secret = Totp.secret();
                const token = Totp.token(secret);

                await User.create({
                    role: UserRole.customer,
                    phone: tokenReq.phone,
                    totpSecret: secret,
                    totpToken: token
                }).save();

                await TwilioSms.send({
                    phone: tokenReq.phone,
                    text: tmplo(tokenReq.text, { token })
                });

                return { success: "OK" };
            } catch (error) {
                return { error: String(error) };
            }
        }
    }

    @Post("/totp/reset")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async authTotpReset(
        @Body() tokenReq: AuthTotpTokenRequest
    ): Promise<AuthTotpTokenResponse> {
        log.info("TOTP reset:", tokenReq);

        const user = await User.findOne({ phone: tokenReq.phone });

        if (user) {
            try {
                const token = Totp.token(user.totpSecret);

                User.merge(user, { totpToken: token });
                await user.save();

                await TwilioSms.send({
                    phone: tokenReq.phone,
                    text: tmplo(tokenReq.text, { token })
                });

                return { success: "OK" };
            } catch (error) {
                return { error: String(error) };
            }
        } else {
            return { error: "User does not exists" };
        }
    }

    @Post("/totp/verify")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async authTotpVerify(
        @Request() req: Request,
        @Body() verifyReq: AuthTotpVerifyRequest
    ): Promise<AuthTotpVerifyResponse> {
        log.info("TOTP verify:", verifyReq);

        const user = await User.findOne({ phone: verifyReq.phone });

        if (user) {
            const verified = user.totpToken === verifyReq.token;
            if (verified) {
                await User.merge(user, { totpVerified: new Date() }).save();
                const payload = {
                    sub: user.id,
                    iss: req.app.pkgname,
                    iat: Math.floor(Date.now() / 1000),
                    exp:
                        Math.floor(Date.now() / 1000) +
                        (verifyReq.exp || req.app.conf.auth.jwt.expiretion),
                    ren: 0
                };
                const jwt = sign(
                    payload,
                    req.app.conf.auth.jwt.secretOrPrivateKey
                );
                return { jwt };
            } else {
                return { error: "Unable to verify token" };
            }
        } else {
            return { error: "No such user" };
        }
    }

    @Post("/sms")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async authSms(@Body() sms: AuthSms): Promise<AuthSmsResponse> {
        log.info("SMS:", sms);
        try {
            const response = await TwilioSms.send(sms);
            return { response };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }
}
