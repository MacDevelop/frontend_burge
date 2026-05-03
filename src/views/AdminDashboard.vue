<template>
  <div class="admin-dashboard">
    <div class="admin-sidebar">
      <div class="sidebar-header">
        <i class="fas fa-hamburger"></i>
        <h3>BurgerHeim Admin</h3>
      </div>
      <nav>
        <button :class="{ active: activeTab === 'reportes' }" @click="activeTab = 'reportes'">
          <i class="fas fa-file-alt"></i> Reportes
        </button>
        <button :class="{ active: activeTab === 'pos' }" @click="activeTab = 'pos'">
          <i class="fas fa-shopping-cart"></i> Punto de Venta
        </button>
        <button :class="{ active: activeTab === 'sales' }" @click="activeTab = 'sales'">
          <i class="fas fa-chart-line"></i> Ventas
        </button>
        <button :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">
          <i class="fas fa-hamburger"></i> Productos
        </button>
        <button v-if="isAdmin" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">
          <i class="fas fa-tags"></i> Categorías
        </button>
        <button v-if="isAdmin" :class="{ active: activeTab === 'employees' }" @click="activeTab = 'employees'">
          <i class="fas fa-users"></i> Empleados
        </button>
        <button v-if="isAdmin" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
          <i class="fas fa-user-shield"></i> Usuarios
        </button>
        <button v-if="isAdmin" :class="{ active: activeTab === 'roles' }" @click="activeTab = 'roles'">
          <i class="fas fa-key"></i> Roles
        </button>
      </nav>
    </div>

    <div class="admin-content">
      <div v-if="!hasValidRole" class="blocked-access">
        <h2>Acceso no permitido</h2>
        <p>Tu rol actual no tiene permiso para ingresar al panel administrativo.</p>
        <p>Solo los roles <strong>Administrador</strong> y <strong>Cajero</strong> pueden acceder.</p>
      </div>
      <template v-else>
        <!-- Punto de Venta -->
        <PosSystem v-if="activeTab === 'pos'" />

        <!-- Ventas -->
        <SalesManager v-if="activeTab === 'sales'" />
        <ReportesManager v-if="activeTab === 'reportes'" />

        <!-- Productos -->
        <ProductsManager v-if="activeTab === 'products'" />

        <!-- Categorías -->
        <CategoriesManager v-if="activeTab === 'categories'" />

        <!-- Empleados -->
        <EmployeesManager v-if="activeTab === 'employees'" />

        <!-- Usuarios -->
        <UsersManager v-if="activeTab === 'users'" />

        <!-- Roles -->
        <RolesManager v-if="activeTab === 'roles'" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import PosSystem from '../components/admin/PosSystem.vue'
import SalesManager from '../components/admin/SalesManager.vue'
import ProductsManager from '../components/admin/ProductsManager.vue'
import CategoriesManager from '../components/admin/CategoriesManager.vue'
import EmployeesManager from '../components/admin/EmployeesManager.vue'
import UsersManager from '../components/admin/UsersManager.vue'
import RolesManager from '../components/admin/RolesManager.vue'
import ReportesManager from '../components/admin/ReportesManager.vue'

const authStore = useAuthStore()

const isAdmin = computed(() => authStore.isAdmin)
const isCajero = computed(() => authStore.isCajero)
const hasValidRole = computed(() => authStore.hasValidRole)

const availableTabs = computed(() => {
  if (isAdmin.value) {
    return ['reportes', 'pos', 'sales', 'products', 'categories', 'employees', 'users', 'roles']
  }
  if (isCajero.value) {
    return ['reportes', 'pos', 'sales', 'products']
  }
  return []
})

const activeTab = ref(availableTabs.value[0] || 'reportes')
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: calc(100vh - 70px);
  background: #0a0c0f;
}

.admin-sidebar {
  width: 280px;
  background: #111316;
  border-right: 1px solid #ff7e05;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #1e2128;
}

.sidebar-header i {
  font-size: 2.5rem;
  color: #ff7e05;
}

.sidebar-header h3 {
  margin-top: 0.5rem;
  color: #ff7e05;
}

.admin-sidebar nav {
  flex: 1;
  padding: 1rem;
}

.admin-sidebar nav button {
  display: block;
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  background: transparent;
  border: none;
  color: #f5ede8;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  border-radius: 10px;
  transition: 0.2s;
}

.admin-sidebar nav button i {
  margin-right: 0.8rem;
  width: 24px;
}

.admin-sidebar nav button:hover,
.admin-sidebar nav button.active {
  background: #ff7e05;
  color: #1a1a1a;
}

.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.blocked-access {
  background: #1e2128;
  border: 2px solid #dc2626;
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  margin-top: 2rem;
}

.blocked-access h2 {
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.blocked-access p {
  color: #f5ede8;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.blocked-access strong {
  color: #ff7e05;
}

@media (max-width: 768px) {
  .admin-dashboard {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ff7e05;
  }

  .admin-sidebar nav {
    display: flex;
    overflow-x: auto;
  }

  .admin-sidebar nav button {
    display: inline-block;
    width: auto;
    white-space: nowrap;
  }
}
</style>
