import * as log4js from "log4js";
import { basename, extname } from "path";
import { Body, Controller, Delete, Get, Path, Post, Put, Request, Route, Security, Tags } from "tsoa";
import { Order } from "../entity/order";
import { OrderAttrs, OrderService } from "../services/order-service";
import { ApiResponse } from "./common";

const log = log4js.getLogger(basename(__filename, extname(__filename)));


interface OrderResponse extends ApiResponse {
    order?: Order;
}

interface OrdersResponse extends ApiResponse {
    orders?: Order[];
}

interface OrderDeleteResponse extends ApiResponse {
    deleted?: Order;
}

/**
 * Operations about Orders.
 *
 * Find more on order operations
 */
@Route("/order")
@Tags("Order")
export class OrderController extends Controller {

    /**
     * Retrieves List of Orders
     */
    @Get("/")
    @Security("api_key", ["user:view"])
    @Security("basic_auth", ["user:view"])
    @Security("jwt", ["user:view"])
    public async orderReadAll(
        @Request() request: Request
    ): Promise<OrdersResponse> {
        log.log("orderSelectAll");
        try {
            const customerId = request.user.sub;
            const orders = await OrderService.readAll(customerId);
            return {orders};
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Get("/{orderId}")
    @Security("api_key", ["user:view"])
    @Security("basic_auth", ["user:view"])
    @Security("jwt", ["user:view"])
    public async orderRead(
        @Request() request: Request,
        @Path() orderId: string
    ): Promise<OrderResponse> {
        log.log("orderSelect:", orderId);
        try {
            const customerId = request.user.sub;
            const order = await OrderService.read(customerId, orderId);
            return { order };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }


    @Post("/")
    @Security("api_key", ["user:create"])
    @Security("basic_auth", ["user:create"])
    @Security("jwt", ["user:create"])
    public async orderCreate(
        @Request() request: Request,
        @Body() orderAttrs: OrderAttrs
    ): Promise<OrderResponse> {
        log.log("orderCreate:", orderAttrs);
        try {
            const username = request.user.sub;
            const order = await OrderService.create(username, orderAttrs);
            return { order };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Put("/{orderId}")
    @Security("api_key", ["user:create"])
    @Security("basic_auth", ["user:create"])
    @Security("jwt", ["user:create"])
    public async orderUpdate(
        @Request() request: Request,
        @Body() orderAttrs: OrderAttrs,
        @Path() orderId: string
    ): Promise<OrderResponse> {
        log.log("orderUpdate:", orderAttrs);
        try {
            const customerId = request.user.sub;
            const order = await OrderService.update(customerId, orderId, orderAttrs);
            return { order };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Delete("/{orderId}")
    @Security("api_key", ["user:create"])
    @Security("basic_auth", ["user:create"])
    @Security("jwt", ["user:create"])
    public async orderDelete(
        @Request() request: Request,
        @Path() orderId: string
    ): Promise<OrderDeleteResponse> {
        log.log("orderDelete:", orderId);
        try {
            const username = request.user.sub;
            const deleted = await OrderService.delete(username, orderId);
            return { deleted };
        } catch (error) {
            log.error("users Listed");
            return { error: String(error) };
        }
    }

    // // CRUD Suborders
    // @Post("/")
    // @Security("api_key", ["user:create"])
    // @Security("basic_auth", ["user:create"])
    // @Security("jwt", ["user:create"])
    // public async subOrderCreate(
    //     @Request() request: Request,
    //     @Body() orderAttrs: OrderAttrs
    // ): Promise<OrderResponse> {
    //     log.log("orderCreate:", orderAttrs);
    //     try {
    //         const username = request.user.sub;
    //         const order = await OrderService.create(username, orderAttrs);
    //         return { order };
    //     } catch (error) {
    //         log.error(error);
    //         return { error: String(error) };
    //     }
    // }
}
