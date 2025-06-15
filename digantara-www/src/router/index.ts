import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import SelectedAssets from "../pages/SelectedAssets.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/selectedAssets", name: "SelectedAssets", component: SelectedAssets },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
