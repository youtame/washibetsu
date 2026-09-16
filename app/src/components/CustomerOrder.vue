<template>
    <v-container class="fill-height max-width-mobile">
        <v-card v-if="step === 1" class="pa-4 w-100 text-center">
            <v-card-title class="text-h6">商品コードを入力</v-card-title>

            <div
                class="text-number text-h1 font-weight-bold my-4 tracking-wide"
            >
                {{ inputCode.padEnd(4, "-") }}
            </div>

            <v-alert
                :type="foundProduct ? 'success' : 'grey'"
                variant="tonal"
                class="mb-4 text-subtitle-1 font-weight-bold"
            >
                {{ foundProduct ? foundProduct.name : "商品を検索中..." }}
            </v-alert>

            <v-row dense>
                <v-col
                    v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
                    :key="n"
                    cols="4"
                >
                    <v-btn
                        block
                        size="x-large"
                        variant="outlined"
                        @click="appendDigit(n.toString())"
                    >
                        {{ n }}
                    </v-btn>
                </v-col>
                <v-col cols="8">
                    <v-btn
                        block
                        size="x-large"
                        color="error"
                        variant="text"
                        @click="clearCode"
                        >クリア</v-btn
                    >
                </v-col>
            </v-row>

            <v-btn
                block
                color="primary"
                size="x-large"
                class="mt-6"
                :disabled="!foundProduct"
                @click="step = 2"
            >
                次へ
            </v-btn>
        </v-card>

        <v-card v-if="step === 2 && foundProduct" class="pa-4 w-100">
            <v-img
                :src="foundProduct.image"
                height="150"
                contain
                class="mb-4"
            />
            <v-card-title class="text-h5 text-center">{{
                foundProduct.name
            }}</v-card-title>
            <v-card-subtitle
                class="text-price text-h6 text-center color-primary"
            >
                ¥{{ foundProduct.price }}
            </v-card-subtitle>

            <div class="text-center my-3">
                <v-btn
                    variant="text"
                    color="info"
                    size="large"
                    @click="allergyDialog = true"
                >
                    アレルギー情報表示
                </v-btn>
            </div>

            <div class="d-flex align-center justify-center my-4">
                <v-btn
                    icon="mdi-minus"
                    variant="outlined"
                    :disabled="selectedQty <= 1"
                    @click="selectedQty--"
                />
                <span class="text-h5 mx-6 font-weight-bold">{{
                    selectedQty
                }}</span>
                <v-btn
                    icon="mdi-plus"
                    variant="outlined"
                    :disabled="selectedQty >= 10"
                    @click="selectedQty++"
                />
            </div>

            <v-alert v-if="isOverBudget" type="warning" class="mt-2">
                上限300円を超過しています（残り上限: ¥{{
                    cartStore.remainingBudget
                }}）
            </v-alert>

            <v-row class="mt-4">
                <v-col cols="6">
                    <v-btn block variant="outlined" @click="resetStep"
                        >戻る</v-btn
                    >
                </v-col>
                <v-col cols="6">
                    <v-btn
                        block
                        color="success"
                        :disabled="isOverBudget"
                        @click="addItemAndContinue"
                    >
                        カゴに入れる
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog v-model="allergyDialog" max-width="360">
            <v-card>
                <v-card-title class="text-h6 font-weight-bold pt-5"
                    >アレルギー情報</v-card-title
                >

                <v-card-text>
                    <div
                        v-for="(v, index) in foundProduct?.variants"
                        :key="index"
                        class="mb-3"
                    >
                        <div
                            v-if="foundProduct?.category !== '単品'"
                            class="text-subtitle-2 font-weight-bold color-primary"
                        >
                            【{{ v.flavor }}】
                        </div>

                        <div class="mt-1">
                            <v-chip
                                v-for="allergen in v.allergens"
                                :key="allergen"
                                class="ma-1"
                                size="small"
                                :color="
                                    allergen === 'なし'
                                        ? 'grey'
                                        : allergen === '不明'
                                          ? 'error'
                                          : 'warning'
                                "
                            >
                                {{ allergen }}
                            </v-chip>
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        block
                        class="font-weight-bold"
                        color="primary"
                        variant="text"
                        size="large"
                        @click="allergyDialog = false"
                    >
                        閉じる
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useCartStore, type Product } from "@/stores/cart";
import { playTapSound } from "@/utils/sound";

const cartStore = useCartStore();

const step = ref(1);
const inputCode = ref("");
const foundProduct = ref<Product | null>(null);
const selectedQty = ref(1);
const allergyDialog = ref(false);

const appendDigit = (digit: string) => {
    if (inputCode.value.length < 4) {
        playTapSound();
        inputCode.value += digit;
    }
};

const clearCode = () => {
    playTapSound();
    inputCode.value = "";
    foundProduct.value = null;
};

watch(inputCode, (newCode) => {
    if (newCode.length === 4) {
        const p = cartStore.findProductByCode(newCode);
        foundProduct.value = p || null;
    } else {
        foundProduct.value = null;
    }
});

const isOverBudget = computed(() => {
    if (!foundProduct.value) return false;
    const addedPrice = foundProduct.value.price * selectedQty.value;
    return cartStore.remainingBudget < addedPrice;
});

const resetStep = () => {
    step.value = 1;
    inputCode.value = "";
    foundProduct.value = null;
    selectedQty.value = 1;
};

const addItemAndContinue = () => {
    if (foundProduct.value) {
        cartStore.addToCart(foundProduct.value, selectedQty.value);
        resetStep();
    }
};
</script>

<style scoped>
.text-number {
    font-size: 30px;
}
.text-price {
    font-size: 20px;
}
.max-width-mobile {
    max-width: 480px;
    margin: 0 auto;
}
</style>
