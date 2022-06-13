import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Request,
    Route,
    Security,
    Tags
} from "tsoa";
import { Zone } from "../entity/zone";
import { ZoneAttrs as ZoneAttrs, ZoneService } from "../services/zone-service";
import { ApiResponse } from "./common";

interface ZonesResponse extends ApiResponse {
    zones?: Zone[];
}

interface ZoneResponse extends ApiResponse {
    zone?: Zone;
}

@Route("/zone")
@Tags("Zone")
export class ZonesController extends Controller {
    @Get("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async zoneReadAll(@Request() request: Request): Promise<ZonesResponse> {
        const sub = request.user.sub;
        try {
            const zones = await ZoneService.readAll(sub);
            return { zones };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Get("/{zoneId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async zoneReadById(
        @Request() request: Request,
        @Path() zoneId: string
    ): Promise<ZoneResponse> {
        const sub = request.user.sub;
        try {
            const zone = await ZoneService.readById(sub, zoneId);
            return { zone };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Post("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async zoneCreate(
        @Request() request: Request,
        @Body() zoneAttrs: ZoneAttrs
    ): Promise<ZoneResponse> {
        const sub = request.user.sub;
        try {
            const zone = await ZoneService.create(sub, zoneAttrs);
            return { zone };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Put("/{zoneId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async zoneUpdate(
        @Request() request: Request,
        @Path() zoneId: string,
        @Body() zoneUpdateAttrs: ZoneAttrs
    ): Promise<ZoneResponse> {
        const sub = request.user.sub;
        try {
            const zone = await ZoneService.update(sub, zoneId, zoneUpdateAttrs);
            return { zone };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Delete("/{zoneId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async zoneDelete(
        @Request() request: Request,
        @Path() zoneId: string
    ): Promise<ZoneResponse> {
        const sub = request.user.sub;
        try {
            const zone = await ZoneService.delete(sub, zoneId);
            return { zone };
        } catch (error) {
            return { error: String(error) };
        }
    }
}
