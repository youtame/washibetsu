import { createRouter, createWebHistory } from "vue-router";
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
    history: createWebHistory(),
    routes,
});

export default router;
