import { createApp } from "vue";
import { createPinia } from "pinia";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";
import router from "./router";

const yuharadoTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: "#6D4C41",
        secondary: "#8D6E63",
        accent: "#D84315",
        background: "#F5F2EB",
        surface: "#FFFFFF",
        error: "#C62828",
        info: "#0288D1",
        success: "#2E7D32",
        warning: "#EF6C00",
    },
};

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "yuharadoTheme",
        themes: {
            yuharadoTheme,
        },
    },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);

app.mount("#app");
