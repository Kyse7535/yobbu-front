import { createWebHistory, createRouter } from "vue-router"


const routes = [
    { path: "/", component: () => import("../views/HomeView.vue") },
    {path:"/trip", component: () => import("../views/TripView.vue")},
    {path: "/:pathMatch(.*)* ", name: 'NotFound' , component: () => import("../views/404View.vue")},
    {path: "/provider", component: () => import("../views/ProviderDetailsView.vue"), props: true}]
    
const router = new createRouter({
    history: createWebHistory(),
    routes
})

export default router
