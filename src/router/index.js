import HomeView from "../views/HomeView.vue"
import { createMemoryHistory, createRouter } from "vue-router"


const routes = [{ path: "/", component: HomeView }]
const router = new createRouter({
    history: createMemoryHistory(),
    routes
})

export default router
