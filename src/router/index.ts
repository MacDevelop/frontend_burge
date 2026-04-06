import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import { authService } from '../services/auth.service'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  console.log('Router guard - to:', to.path, 'isAuthenticated:', authService.isAuthenticated())
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    console.log('Redirecting to login')
    return '/login'
  }

  return true
})

export default router
