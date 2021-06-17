import Vue from "vue";
import VueRouter from "vue-router";
import OrderProducts from "../views/Home.vue";
import "../plugins/bootstrap.scss";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "OrderProducts",
    component: OrderProducts,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/test",
    name: "Page test",
    component: () => import("../components/App/NutribeCompta/testTemplate.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
