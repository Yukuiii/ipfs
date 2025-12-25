import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/components/RegisterPage.vue"),
  },
];

/**
 * 路由实例。
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
