import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/home-client",
    children: [
      {
        path: "/",
        name: "homeClient",
        component: () => import("@/views/Client/HomeView.vue"),
      },
      {
        path: "/provider",
        name: "provider",
        component: () => import("@/views/Client/ProviderDetailsView.vue"),
        props: true,
      },
      {
        path: "/command",
        name: "order",
        component: () => import("@/views/Client/CommandView.vue"),
      },
      {
        path: "/panier",
        name: "panier",
        component: () => import("@/views/Client/PanierView.vue"),
      },
      {
        path: "/trip",
        name: "trip",
        component: () => import("@/views/Client/TripView.vue"),
      },
    ],
  },
  {
    path: "/home-provider",
    name: "homeProvider",
    component: () => import("@/views/Provider/HomeView.vue"),
  },
  {
    path: "/:pathMatch(.*)* ",
    name: "NotFound",
    component: () => import("@/views/404View.vue"),
  },
  {
    path: "/getTrips",
    name: "providerGetTrips",
    component: () => import("@/views/Provider/GetTripsView.vue"),
  },
  {
    path: "/addTrip",
    name: "providerAddTrips",
    component: () => import("@/views/Provider/AddTripsView.vue"),
  },
];

const router = new createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
