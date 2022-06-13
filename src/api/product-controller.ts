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
import { Product } from "../entity/product";
import {
    ProductAllergen,
    productAllergens as allergenes,
    productCategories as categories,
    ProductCategory
} from "../entity/producttype";
import { ProductAttrs, ProductService } from "../services/product-service";
import { ApiResponse } from "./common";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

interface ProductsResponse extends ApiResponse {
    products?: Product[];
}

interface ProductResponse extends ApiResponse {
    product?: Product;
}

@Route("/product")
@Tags("Product")
export class ProductController extends Controller {
    @Get("/allergens")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productAllergenes(): Promise<{ allergenes: ProductAllergen[] }> {
        log.info("productAllergenes:", allergenes);
        return { allergenes };
    }

    @Get("/categories")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productCategories(): Promise<{ categories: ProductCategory[] }> {
        log.info("productCategories:", categories);
        return { categories };
    }

    @Get("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productReadAll(
        // @Request() request: Request
    ): Promise<ProductsResponse> {
        // const sub = request.user.sub;
        // log.info("productReadAll:", sub);
        log.info("productReadAll:");
        try {
            const products = await ProductService.readAll();
            return { products };
        } catch (error) {
            return { error: String(error) };
        }
    }

    @Get("/{productId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productReadById(
        @Request() request: Request,
        @Path() productId: string
    ): Promise<ProductResponse> {
        const sub = request.user.sub;
        log.info("productReadById:", sub, productId);
        try {
            const product = await ProductService.readById(sub, productId);
            return { product };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Post("/")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productCreate(
        @Request() request: Request,
        @Body() productAttrs: ProductAttrs
    ): Promise<ProductResponse> {
        const sub = request.user.sub;
        log.info("productCreate:", sub, productAttrs);
        try {
            const product = await ProductService.create(sub, productAttrs);
            return { product };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Put("/{productId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productUpdate(
        @Request() request: Request,
        @Path() productId: string,
        @Body() productUpdateAttrs: ProductAttrs
    ): Promise<ProductResponse> {
        const sub = request.user.sub;
        log.info("productUpdate:", sub, productId, productUpdateAttrs);
        try {
            const product = await ProductService.update(
                sub,
                productId,
                productUpdateAttrs
            );
            return { product };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }

    @Delete("/{productId}")
    @Security("api_key", ["admin"])
    @Security("basic_auth", ["admin"])
    @Security("jwt", ["admin"])
    async productDelete(
        @Request() request: Request,
        @Path() productId: string
    ): Promise<ProductResponse> {
        const sub = request.user.sub;
        log.info("productDelete:", sub, productId);
        try {
            const product = await ProductService.delete(sub, productId);
            return { product };
        } catch (error) {
            log.error(error);
            return { error: String(error) };
        }
    }
}
