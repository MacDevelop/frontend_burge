import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import { authService } from '../services/auth.service'

const allowedAdminRoles = ['Administrador', 'Cajero']

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
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()
  const userRole = user?.rol?.nombre?.toString() || ''
  const validRole = allowedAdminRoles.some(
    (role) => role.toLowerCase() === userRole.toLowerCase(),
  )

  console.log('Router guard - to:', to.path, 'isAuthenticated:', isAuthenticated, 'userRole:', userRole)

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login')
    return '/login'
  }

  if (to.path === '/admin' && isAuthenticated && !validRole) {
    console.log('Usuario con rol no permitido:', userRole)
    authService.logout()
    return '/login'
  }

  return true
})

export default router
