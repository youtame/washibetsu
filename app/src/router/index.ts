import { createRouter, createWebHashHistory } from "vue-router";
import CustomerApp from "../views/CustomerApp.vue";
import StaffScanner from "../components/StaffScanner.vue";

const routes = [
    {
        path: "/",
        name: "Customer",
        component: CustomerApp,
    },
    {
        path: "/staff",
        name: "Staff",
        component: StaffScanner,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
