import { defineStore } from "pinia";
import productsData from "@/data/products.json";

// define flavor master
export interface ProductVariant {
    flavor: string;
    allergens: string[];
}

// define products master
export interface Product {
    id: string;
    code: string;
    category: string;
    name: string;
    price: number;
    image: string;
    variants: ProductVariant[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export const useCartStore = defineStore("cart", {
    state: () => ({
        products: productsData as Product[],
        cart: [] as CartItem[],
        budgetLimit: 300,
    }),
    getters: {
        totalAmount: (state) => {
            return state.cart.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0,
            );
        },
        remainingBudget(): number {
            return this.budgetLimit - this.totalAmount;
        },
        qrPayload(): string {
            const payload = {
                t: Date.now(),
                i: this.cart.map((item) => ({
                    id: item.product.id,
                    q: item.quantity,
                })),
            };
            return JSON.stringify(payload);
        },
    },
    actions: {
        findProductByCode(code: string): Product | undefined {
            return this.products.find((p) => p.code === code);
        },
        addToCart(product: Product, quantity: number) {
            const existing = this.cart.find(
                (item) => item.product.id === product.id,
            );
            if (existing) {
                existing.quantity += quantity;
            } else {
                this.cart.push({ product, quantity });
            }
        },
        removeFromCart(productId: string) {
            const index = this.cart.findIndex(
                (item) => item.product.id === productId,
            );
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        },
    },
});
