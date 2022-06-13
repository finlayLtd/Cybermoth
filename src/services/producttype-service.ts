import { User } from "../entity/user";
import {
    Days,
    ProductAllergen,
    ProductCategory,
    ProductType
} from "../entity/producttype";

export interface ProductTypeAttrs {
    name?: string;
    description?: string;
    details?: string;
    category?: ProductCategory;
    allergens?: ProductAllergen[];
    bio?: boolean;
    gmo?: boolean;
    tax?: number;
    productionTime?: Days;
}

export class ProductTypeService {
    static async readAll(vendorId: string): Promise<ProductType[]> {
        return await ProductType.find({ where: { vendor: { id: vendorId } } });
    }

    static async readById(
        vendorId: string,
        productTypeId: string
    ): Promise<ProductType> {
        return await ProductType.findOneOrFail({
            where: { id: productTypeId, vendor: { id: vendorId } }
        });
    }

    static async create(
        vendorId: string,
        productTypeAttrs: ProductTypeAttrs
    ): Promise<ProductType> {
        const vendor = await User.findOne({ where: { id: vendorId } });
        const productType = ProductType.create(productTypeAttrs);
        productType.vendor = vendor;
        return await productType.save();
    }

    static async update(
        vendorId: string,
        productTypeId: string,
        productTypeAttrs: ProductTypeAttrs
    ): Promise<ProductType> {
        const productType = await ProductType.findOne({
            where: { id: productTypeId, vendor: { id: vendorId } }
        });
        if (productType) {
            ProductType.merge(productType, productTypeAttrs);
            return await productType.save();
        } else {
            throw new Error("Invalid ProductType");
        }
    }

    static async delete(
        vendorId: string,
        productTypeId: string
    ): Promise<ProductType> {
        const productType = await ProductType.findOne({
            where: { id: productTypeId, vendor: { id: vendorId } }
        });
        if (productType) {
            return await productType.remove();
        } else {
            throw new Error("ProductType doesn't exist");
        }
    }
}
