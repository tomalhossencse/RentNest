import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";

export interface SSLCommerzInitPayload {
    // Required
    store_id: string;
    store_passwd: string;
    total_amount: number;
    currency: string;
    tran_id: string;

    success_url: string;
    fail_url: string;
    cancel_url: string;

    product_name: string;
    product_category: string;
    product_profile: "general" | "physical-goods" | "non-physical-goods";

    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_country: string;
    cus_phone: string;

    // Recommended
    ipn_url?: string;

    // Customer (optional)
    cus_add2?: string;
    cus_state?: string;
    cus_postcode?: number;
    cus_fax?: string;

    // Shipping
    shipping_method?: string;
    ship_name?: string;
    ship_add1?: string;
    ship_add2?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string;
    ship_country?: string;

    // Gateway options
    multi_card_name?: string;

    // EMI
    emi_option?: 0 | 1;
    emi_max_inst_option?: number;
    emi_selected_inst?: number;

    // Custom values
    value_a?: string;
    value_b?: string;
    value_c?: string;
    value_d?: string;
}
