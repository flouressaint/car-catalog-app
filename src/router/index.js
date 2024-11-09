import { createMemoryHistory, createRouter } from 'vue-router'
import Login from '@/pages/auth/Login.vue'
import Cars from '@/pages/Cars.vue'
import CarCategories from '@/pages/CarCategories.vue'
import Profile from '@/pages/auth/Profile.vue'

const routes = [
    { path: '/', component: Cars },
    { path: '/login', name: 'login', component: Login },
    { path: '/cars', name: 'cars', component: Cars },
    { path: '/car-categories', name: 'car-categories', component: CarCategories },
    // { path: '/profile', name: 'profile', component: Profile }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router