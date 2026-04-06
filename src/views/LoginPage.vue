<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo en la parte superior con ícono de hamburguesa -->
      <div class="card-header">
        <div class="logo-container">
          <i class="fas fa-hamburger logo-icon"></i>
        </div>
      </div>

      <div class="login-content">
        <div class="login-header">
          <i class="fas fa-hamburger"></i>
          <h2>BurgerHeim Admin</h2>
          <p>Ingresa al panel de administración</p>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              v-model="identifier" 
              placeholder="Usuario o email" 
              required 
            />
          </div>
          
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="Contraseña" 
              required 
            />
            <i 
              :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" 
              @click="togglePassword"
              class="password-toggle"
            ></i>
          </div>
          
          <button type="submit" class="btn-login" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
            <i class="fas fa-arrow-right"></i>
          </button>
        </form>
        
        <div class="error-container" v-if="error">
          <p class="error">{{ error }}</p>
        </div>

        <!-- Botón de volver al inicio debajo del botón ingresar -->
        <button @click="goToHome" class="btn-home">
          <i class="fas fa-home"></i>
          Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const authStore = useAuthStore()
const adminStore = useAdminStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const success = await authStore.login(identifier.value, password.value)
    if (success) {
      router.push('/admin')
      adminStore.init().catch((initError: any) => {
        console.error('Admin store init failed:', initError)
      })
    } else {
      error.value = 'Credenciales incorrectas'
    }
  } catch (err: any) {
    error.value = err.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const goToHome = () => {
  router.push('/')
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0c0f, #1a1e26);
  padding: 2rem;
}

.login-card {
  background: #1e2128;
  border-radius: 2rem;
  width: 100%;
  max-width: 480px;
  border: 1px solid #ff7e05;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #ff7e05, #ff9f3a);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container {
  background: white;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logo-icon {
  font-size: 5rem;
  color: #ff7e05;
}

.login-content {
  padding: 3rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header i {
  font-size: 4rem;
  color: #ff7e05;
  margin-bottom: 1rem;
}

.login-header h2 {
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.login-header p {
  color: #aaa;
  margin: 0;
}

.input-group {
  display: flex;
  align-items: center;
  background: #2c313a;
  border-radius: 50px;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.input-group:focus-within {
  box-shadow: 0 0 0 2px #ff7e05;
}

.input-group i:first-child {
  color: #ff7e05;
  margin-right: 1rem;
}

.input-group input {
  background: none;
  border: none;
  color: white;
  width: 100%;
  outline: none;
  font-size: 1rem;
}

.input-group input::placeholder {
  color: #888;
}

.password-toggle {
  cursor: pointer;
  color: #888;
  transition: color 0.2s ease;
  margin-left: 0.5rem;
}

.password-toggle:hover {
  color: #ff7e05;
}

.btn-login {
  background: #ff7e05;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;
  margin-bottom: 1rem;
}

.btn-login:hover:not(:disabled) {
  background: #ff9f3a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 126, 5, 0.3);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-home {
  background: transparent;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ff7e05;
  border-radius: 50px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ff7e05;
}

.btn-home:hover {
  background: rgba(255, 126, 5, 0.1);
  transform: translateY(-2px);
}

.error-container {
  margin-bottom: 1rem;
}

.error {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    max-width: 95%;
  }
  
  .login-content {
    padding: 2rem;
  }
  
  .logo-container {
    width: 100px;
    height: 100px;
  }
  
  .logo-icon {
    font-size: 4rem;
  }
}
</style>