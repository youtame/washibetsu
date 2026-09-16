<template>
    <v-container>
        <v-tabs
            v-model="tab"
            color="primary"
            grow
            class="mb-4 bg-white rounded"
        >
            <v-tab value="input">商品追加</v-tab>
            <v-tab value="cart">
                カゴを見る
                <v-badge
                    v-if="cartStore.cart.length > 0"
                    :content="cartStore.cart.length"
                    color="error"
                    inline
                />
            </v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="input">
                <CustomerOrder />
            </v-window-item>
            <v-window-item value="cart">
                <CartView />
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CustomerOrder from "@/components/CustomerOrder.vue";
import CartView from "@/components/CartView.vue";
import { useCartStore } from "@/stores/cart";

const tab = ref("input");
const cartStore = useCartStore();
</script>
