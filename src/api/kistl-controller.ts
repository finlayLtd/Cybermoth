import * as log4js from "log4js";
import { basename, extname } from "path";
import { Body, Controller, Delete, Get, Path, Post, Put, Request, Route, Security, Tags } from "tsoa";
import { Kistl } from "../entity/kistl";
import { KistlAttrs, KistlService } from "../services/kistl-service";
import { ApiResponse } from "./common";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

interface KistlResponse extends ApiResponse {
    kistl?: Kistl;
}

interface KistlsResponse extends ApiResponse {
    kistls?: Kistl[];
}

/**`
 * Operations about Orders.
 *
 * Find more on order operations
 */
@Route("/kistl")
@Tags("Kistl")
export class KistlController extends Controller {

    @Get("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async kistlReadAll(
        @Request() request: Request
    ): Promise<KistlsResponse> {
        log.info("kistlReadAll");
        try {
            const userId = request.user.sub;
            const kistls = await KistlService.readAll(userId);
            return { kistls };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Get("/{kistlId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    public async kistlReadById(
        @Request() request: Request,
        kistlId: string
    ): Promise<KistlResponse> {
        log.info("kistlReadById:", kistlId);
        try {
            const userId = request.user.sub;
            const kistl = await KistlService.readById(userId, kistlId);
            return { kistl };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Post("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    public async kistlCreate(
        @Request() request: Request,
        @Body() kistlAttrs: KistlAttrs
    ): Promise<KistlResponse> {
        log.info("kistlCreate:", kistlAttrs);
        try {
            const userId = request.user.sub;
            const kistl = await KistlService.create(userId, kistlAttrs);
            return { kistl };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Put("/{kistlId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    public async kistlUpdate(
        @Request() request: Request,
        kistlId: string,
        @Body() kistlAttrs: KistlAttrs
    ): Promise<KistlResponse> {
        log.info("kistlUpdate:", kistlAttrs);
        try {
            const userId = request.user.sub;
            const kistl = await KistlService.update(userId, kistlId, kistlAttrs);
            return { kistl };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Delete("/{kistlId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    public async kistlDelete(
        @Request() request: Request,
        @Path() kistlId: string
    ): Promise<KistlResponse> {
        log.info("kistlDelete:", kistlId);
        try {
            const userId = request.user.sub;
            const kistl = await KistlService.delete(userId, kistlId);
            return { kistl };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }
}
