import { User } from "../entity/user";
import { Product, ProductUnit } from "../entity/product";
import { Days, ProductAllergen, ProductCategory } from "../entity/producttype";

export interface ProductAttrs {
    name?: string;
    description?: string;
    details?: string;
    category?: ProductCategory;
    allergens?: ProductAllergen[];
    bio?: boolean;
    gmo?: boolean;
    tax?: number;
    productionTime?: Days;

    amount?: number;
    unit?: ProductUnit;
    price?: number;
    min?: number;
    max?: number;
}

export class ProductService {

    static async readAll(): Promise<Product[]> {
        return await Product.find();
    }

    static async readVendorAll(vendorId: string): Promise<Product[]> {
        return await Product.find({ where: { vendor: { id: vendorId } } });
    }

    static async readById(
        vendorId: string,
        productId: string
    ): Promise<Product> {
        return await Product.findOneOrFail({
            where: { id: productId, vendor: { id: vendorId } }
        });
    }

    static async create(
        vendorId: string,
        productAttrs: ProductAttrs
    ): Promise<Product> {
        const vendor = await User.findOne({ where: { id: vendorId } });
        const product = Product.create(productAttrs);
        product.vendor = vendor;
        return await product.save();
    }

    static async update(
        vendorId: string,
        productId: string,
        productAttrs: ProductAttrs
    ): Promise<Product> {
        const product = await Product.findOne({
            where: { id: productId, vendor: { id: vendorId } }
        });
        if (product) {
            Product.merge(product, productAttrs);
            return await product.save();
        } else {
            throw new Error("Invalid Product");
        }
    }

    static async delete(vendorId: string, productId: string): Promise<Product> {
        const product = await Product.findOne({
            where: { id: productId, vendor: { id: vendorId } }
        });
        if (product) {
            return await product.remove();
        } else {
            throw new Error("Product doesn't exist");
        }
    }
}
