import {createRouter, createWebHistory} from 'vue-router'
import Offer from '../views/Offer.vue'
import Ordered from '../views/Ordered.vue'
import Upload from '../views/Upload.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import store from '../store/store'

const routes = [
    {path: '/offer', component: Offer, name: 'Offer'},
    {path: '/ordered', component: Ordered, meta: {requiresAuth: true}, name: 'Ordered'},
    {path: '/upload', component: Upload, meta: {requiresAuth: true}, name: 'Upload'},
    {path: '/login', component: Login, name: 'Login'},
    {path: '/register', component: Register, name: 'Register'},
    {path: '/', redirect: '/offer', name: 'Home'},
]

const router = createRouter({
    history: createWebHistory(), routes,
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {
            next({name: 'Login'})
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router