import { Controller, Get, Hidden, Request, Route, Security } from "tsoa";
import swaggerDoc from "../generated/swagger.json";

/**
 * Root controller
 */
@Route("/")
@Hidden()
export class RootController extends Controller {
    @Get("/swagger.json")
    @Security("api_key")
    @Security("basic_auth")
    @Security("jwt")
    public async getSwaggerJson(@Request() req: Request): Promise<object> {
        return swaggerDoc;
    }
}
