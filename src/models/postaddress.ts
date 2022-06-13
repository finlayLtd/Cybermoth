/**
 * Austria Address
 *
 * https://en.wikipedia.org/wiki/Address#Austria
 */
export interface PostAddress {
    /** Natural Person/Organization */
    name: string;

    /** More detailed description of addressee (optional) */
    detail?: string;

    /** Street name + number */
    street: string;

    /** Postal code */
    postcode: string;

    /** City/Town */
    city: string;

    /** Country (if other than Austria) */
    country?: string;
}
