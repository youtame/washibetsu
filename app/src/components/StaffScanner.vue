<template>
    <v-container class="max-width-tablet pa-4">
        <v-card class="pa-6 rounded-lg" elevation="2">
            <v-card-title
                class="text-h5 font-weight-bold text-center mb-2 color-primary"
            >
                スキャナ
            </v-card-title>

            <div id="reader" class="my-4 rounded-lg overflow-hidden"></div>

            <v-card
                v-if="scannedOrder"
                color="surface"
                class="pa-6 mt-4 rounded-xl"
                elevation="3"
            >
                <v-card-title
                    class="text-h6 d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center pb-2"
                >
                    <span class="font-weight-bold mb-1 mb-sm-0">注文内容</span>
                    <v-chip
                        size="default"
                        color="info"
                        variant="tonal"
                        class="font-weight-bold mt-2 mt-sm-0"
                    >
                        QR生成時刻: {{ scannedTime }}
                    </v-chip>
                </v-card-title>

                <v-divider class="my-3" />

                <v-list class="bg-transparent pa-0">
                    <v-list-item
                        v-for="(item, i) in scannedOrder.items"
                        :key="i"
                        class="py-3 px-2 border-b"
                    >
                        <div
                            class="d-flex justify-space-between align-center w-100"
                        >
                            <div>
                                <div class="text-h6 font-weight-bold mb-1">
                                    {{ item.name }}
                                </div>
                                <div class="text-subtitle-1 text-grey-darken-1">
                                    単価: ¥{{ item.price }} / 小計: ¥{{
                                        item.price * item.quantity
                                    }}
                                </div>
                            </div>

                            <div class="d-flex align-center">
                                <v-chip
                                    color="primary"
                                    variant="flat"
                                    size="x-large"
                                    class="px-4 py-2 text-h5 font-weight-bold"
                                >
                                    {{ item.quantity }} 個
                                </v-chip>
                            </div>
                        </div>
                    </v-list-item>
                </v-list>

                <v-divider class="my-4" />

                <div
                    class="d-flex justify-space-between align-center my-3 text-h5 font-weight-bold"
                >
                    <span>合計金額:</span>
                    <span
                        class="text-h4 font-weight-bold"
                        :class="
                            scannedOrder.total > 300
                                ? 'text-error'
                                : 'text-success'
                        "
                    >
                        ¥{{ scannedOrder.total }}
                    </span>
                </div>

                <v-alert
                    :type="scannedOrder.total > 300 ? 'error' : 'success'"
                    variant="tonal"
                    class="mt-4 font-weight-bold text-subtitle-1 pa-4 rounded-lg"
                >
                    {{ scannedOrder.total > 300 ? "300円を超過" : "300円以内" }}
                </v-alert>

                <v-btn
                    block
                    size="x-large"
                    color="primary"
                    class="mt-6 text-h6 font-weight-bold py-4"
                    @click="resetScanner"
                >
                    次のスキャンへ
                </v-btn>
            </v-card>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Html5QrcodeScanner } from "html5-qrcode";
import productsData from "@/data/products.json";
import { playSuccessSound } from "@/utils/sound";

interface ScannedItem {
    name: string;
    price: number;
    quantity: number;
}

const scannedOrder = ref<{ items: ScannedItem[]; total: number } | null>(null);
const scannedTime = ref("");
let scanner: Html5QrcodeScanner | null = null;

const onScanSuccess = (decodedText: string) => {
    if (scannedOrder.value) return;

    try {
        const data = JSON.parse(decodedText);

        if (data.t) {
            const date = new Date(data.t);
            scannedTime.value = date.toLocaleTimeString("ja-JP");
        }

        let total = 0;
        const items: ScannedItem[] = [];

        data.i.forEach((item: { id: string; q: number }) => {
            const p = productsData.find((prod) => prod.id === item.id);
            if (p) {
                items.push({
                    name: p.name,
                    price: p.price,
                    quantity: item.q,
                });
                total += p.price * item.q;
            }
        });

        scannedOrder.value = { items, total };
        playSuccessSound();

        if (scanner) {
            try {
                scanner.pause(true);
            } catch (e) {
                console.error("Pause error:", e);
            }
        }
    } catch (e) {
        alert("無効な二次元コードです。");
    }
};

const resetScanner = () => {
    scannedOrder.value = null;

    if (scanner) {
        try {
            scanner.resume();
        } catch (e) {
            console.error("Resume error:", e);
        }
    }
};

onMounted(() => {
    scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
    );
    scanner.render(onScanSuccess, () => {});
});

onUnmounted(() => {
    if (scanner) {
        scanner.clear().catch((error) => console.error(error));
    }
});
</script>

<style scoped>
.max-width-tablet {
    max-width: 640px;
    margin: 0 auto;
}

.border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.border-b:last-child {
    border-bottom: none;
}
</style>
