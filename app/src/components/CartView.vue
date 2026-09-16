<template>
    <v-card class="pa-4 max-width-mobile mx-auto my-4">
        <v-card-title class="text-h6 d-flex justify-space-between align-center">
            <span>現在のカゴ</span>
            <v-chip color="primary" font-weight-bold>
                合計: ¥{{ cartStore.totalAmount }} / ¥300
            </v-chip>
        </v-card-title>

        <v-progress-linear
            :model-value="(cartStore.totalAmount / 300) * 100"
            :color="cartStore.totalAmount > 300 ? 'error' : 'success'"
            height="10"
            rounded
            class="my-2"
        />

        <v-list v-if="cartStore.cart.length > 0">
            <v-list-item
                v-for="item in cartStore.cart"
                :key="item.product.id"
                class="px-0"
            >
                <template #prepend>
                    <v-avatar rounded size="40" color="grey-lighten-2">
                        <v-img :src="item.product.image" />
                    </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                    {{ item.product.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    ¥{{ item.product.price }} × {{ item.quantity }} = ¥{{
                        item.product.price * item.quantity
                    }}
                </v-list-item-subtitle>

                <template #append>
                    <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        size="small"
                        @click="cartStore.removeFromCart(item.product.id)"
                    />
                </template>
            </v-list-item>
        </v-list>

        <v-alert v-else type="info" variant="tonal" class="my-4 text-center">
            カゴに商品が入っていません
        </v-alert>

        <v-btn
            block
            color="success"
            size="x-large"
            class="mt-4 font-weight-bold"
            :disabled="
                cartStore.cart.length === 0 || cartStore.totalAmount > 300
            "
            @click="openQrModal"
        >
            注文を確定してコードを表示
        </v-btn>

        <v-dialog v-model="qrModal" max-width="360" persistent>
            <v-card class="text-center pa-4">
                <v-card-title class="text-h6 font-weight-bold">
                    QRをご提示ください
                </v-card-title>

                <div class="my-4 d-flex justify-center">
                    <qrcode-vue
                        :value="cartStore.qrPayload"
                        :size="220"
                        level="M"
                    />
                </div>

                <div class="text-caption text-grey">
                    作成時刻: {{ generatedTime }}
                </div>
                <div class="text-subtitle-2 font-weight-bold mt-1">
                    合計金額: ¥{{ cartStore.totalAmount }}
                </div>

                <v-card-actions class="mt-4">
                    <v-btn
                        block
                        color="primary"
                        variant="outlined"
                        @click="qrModal = false"
                    >
                        画面を閉じる
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();
const qrModal = ref(false);
const generatedTime = ref("");

const openQrModal = () => {
    const now = new Date();
    generatedTime.value = now.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    qrModal.value = true;
};
</script>

<style scoped>
.max-width-mobile {
    max-width: 480px;
}
</style>
