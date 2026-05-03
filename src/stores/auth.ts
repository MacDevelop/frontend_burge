import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<any>(null)
  const token = ref<string | null>(null)

  const userRole = computed(() => user.value?.rol?.nombre?.toString() || '')
  const isAdmin = computed(() => userRole.value.toLowerCase() === 'administrador')
  const isCajero = computed(() => userRole.value.toLowerCase() === 'cajero')
  const hasValidRole = computed(
    () => isAdmin.value || isCajero.value,
  )

  const login = async (identifier: string, password: string) => {
    try {
      const response = await authService.login({ identifier, password })
      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true
      console.log('Login successful, token:', token.value)
      return true
    } catch (error: any) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    authService.logout()
    token.value = null
    user.value = null
    isAuthenticated.value = false
  }

  const checkAuth = () => {
    token.value = authService.getToken()
    user.value = authService.getUser()
    isAuthenticated.value = !!token.value
  }

  checkAuth()

  return {
    isAuthenticated,
    user,
    token,
    userRole,
    isAdmin,
    isCajero,
    hasValidRole,
    login,
    logout,
    checkAuth,
  }
})
