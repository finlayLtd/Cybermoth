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
import { ProductType } from "../entity/producttype";
import {
    ProductTypeAttrs,
    ProductTypeService
} from "../services/producttype-service";
import { ApiResponse } from "./common";

interface ProductTypesResponse extends ApiResponse {
    productTypes?: ProductType[];
}

interface ProductTypeResponse extends ApiResponse {
    productType?: ProductType;
}

@Route("/product-type")
@Tags("ProductType")
export class ProductTypeController extends Controller {
    @Get("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productTypeReadAll(
        @Request() request: Request
    ): Promise<ProductTypesResponse> {
        const sub = request.user.sub;
        try {
            const productTypes = await ProductTypeService.readAll(sub);
            return { productTypes };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Get("/{productTypeId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productTypeReadById(
        @Request() request: Request,
        @Path() productTypeId: string
    ): Promise<ProductTypeResponse> {
        const sub = request.user.sub;
        try {
            const productType = await ProductTypeService.readById(
                sub,
                productTypeId
            );
            return { productType };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Post("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productTypeCreate(
        @Request() request: Request,
        @Body() productTypeAttrs: ProductTypeAttrs
    ): Promise<ProductTypeResponse> {
        const sub = request.user.sub;
        try {
            const productType = await ProductTypeService.create(
                sub,
                productTypeAttrs
            );
            return { productType };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Put("/{productTypeId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productTypeUpdate(
        @Request() request: Request,
        @Path() productTypeId: string,
        @Body() productTypeUpdateAttrs: ProductTypeAttrs
    ): Promise<ProductTypeResponse> {
        const sub = request.user.sub;
        try {
            const productType = await ProductTypeService.update(
                sub,
                productTypeId,
                productTypeUpdateAttrs
            );
            return { productType };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Delete("/{productTypeId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productTypeDelete(
        @Request() request: Request,
        @Path() productTypeId: string
    ): Promise<ProductTypeResponse> {
        const sub = request.user.sub;
        try {
            const productType = await ProductTypeService.delete(
                sub,
                productTypeId
            );
            return { productType };
        } catch (error) {
            return { error: String(error) };
        }
    }
}
