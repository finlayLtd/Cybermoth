import * as log4js from "log4js";
import { basename, extname } from "path";
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
import { User } from "../entity/user";
import { UserService, UserAttrs } from "../services/user-service";
import { ApiResponse } from "./common";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

interface UserResponse extends ApiResponse {
    user?: User;
}

interface UsersResponse extends ApiResponse {
    users?: User[];
}

@Route("/user")
@Tags("User")
export class UsersController extends Controller {
    @Get("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async userReadAll(): Promise<UsersResponse> {
        log.info("userReadAll");
        try {
            const users = await UserService.readAll();
            return { users };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Get("/{userId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async userReadById(@Path() userId: string): Promise<UserResponse> {
        log.info("userReadById:", userId);
        try {
            const user = await UserService.readById(userId);
            return { user };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Post("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async userCreate(@Body() userAttrs: UserAttrs): Promise<UserResponse> {
        log.info("userCreate:", userAttrs);
        try {
            const user = await UserService.create(userAttrs);
            return { user };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Put("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async userUpdate(
        @Request() request: Request,
        @Body() userAttrs: UserAttrs
    ): Promise<UserResponse> {
        log.info("userUpdate:", userAttrs);
        const userId = request.user.sub;
        try {
            const user = await UserService.update(userId, userAttrs);
            return { user };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Delete("/{userId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async userDelete(
        @Path() userId: string
    ): Promise<UserResponse> {
        log.info("userDelete:", userId);
        try {
            const user = await UserService.delete(userId);
            return { user };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }
}
