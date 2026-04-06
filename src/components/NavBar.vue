<template>
  <header>
    <div class="container">
      <div class="navbar">
        <div class="logo" @click="scrollTo('inicio')">
          <i class="fas fa-hamburger"></i> BURGER<span style="color: #ff7e05">HEIM</span>
        </div>

        <div class="menu-icon" @click="mobileMenuOpen = !mobileMenuOpen">
          <i class="fas fa-bars"></i>
        </div>

        <ul :class="['nav-links', { active: mobileMenuOpen }]">
          <li><a href="#" @click.prevent="scrollTo('inicio')">Inicio</a></li>
          <li><a href="#" @click.prevent="scrollTo('menu')">Menú</a></li>
          <li><a href="#" @click.prevent="scrollTo('nosotros')">Nosotros</a></li>
          <li><a href="#" @click.prevent="scrollTo('contacto')">Contacto</a></li>
          <li v-if="!authStore.isAuthenticated">
            <button class="admin-btn" @click="$router.push('/login')">
              <i class="fas fa-user-shield"></i> Admin
            </button>
          </li>
          <li v-else>
            <div class="user-menu">
              <span><i class="fas fa-user-cog"></i> {{ authStore.user?.nombre_usuario }}</span>
              <button @click="goToAdmin" class="admin-panel-btn">
                <i class="fas fa-chalkboard-user"></i> Panel
              </button>
              <button @click="logout" class="logout-btn">Salir</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const scrollTo = (sectionId: string) => {
  mobileMenuOpen.value = false
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  } else {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToAdmin = () => {
  router.push('/admin')
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
header {
  background: #0e0f12e6;
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 126, 5, 0.3);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.9rem;
  color: #ff7e05;
  cursor: pointer;
  text-shadow: 2px 2px 0 #3a1f00;
}

.menu-icon {
  display: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #ff7e05;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #f5ede8;
  font-weight: 600;
  transition: 0.2s;
  cursor: pointer;
}

.nav-links a:hover {
  color: #ff7e05;
}

.admin-btn {
  background: #ff7e05;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 40px;
  color: #1a1a1a;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: #1e2128;
  padding: 0.3rem 1rem;
  border-radius: 40px;
}

.admin-panel-btn {
  background: #ff7e05;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
}

.logout-btn {
  background: #dc2626;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  cursor: pointer;
  color: white;
}

@media (max-width: 768px) {
  .menu-icon {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: -100%;
    background: #0e0f12f5;
    backdrop-filter: blur(16px);
    width: 80%;
    height: 100vh;
    flex-direction: column;
    padding: 2rem;
    transition: 0.3s;
    z-index: 99;
  }

  .nav-links.active {
    left: 0;
  }

  .user-menu {
    flex-direction: column;
  }
}
</style>
