<template>
  <div class="manager-container">
    <div class="section-header">
      <h2><i class="fas fa-users"></i> Empleados</h2>
      <button @click="openModal" class="btn-add"><i class="fas fa-plus"></i> Nuevo Empleado</button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>CI</th>
          <th>Nombre Completo</th>
          <th>Cargo</th>
          <th>Celular</th>
          <th>Email</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in paginatedEmployees" :key="emp.id">
          <td>{{ emp.id }}</td>
          <td>{{ emp.cedulaIdentidad }}</td>
          <td>{{ emp.nombre }} {{ emp.apellidoPaterno }} {{ emp.apellidoMaterno }}</td>
          <td>{{ emp.cargo }}</td>
          <td>{{ emp.celular }}</td>
          <td>{{ emp.email }}</td>
          <td>
            <span :class="['status-badge', emp.activo ? 'active' : 'inactive']">
              {{ emp.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <button @click="editEmployee(emp)" class="btn-edit" title="Editar"><i class="fas fa-eye"></i></button>
            <button @click="toggleStatus(emp.id, emp.activo)" class="btn-toggle" :title="emp.activo ? 'Desactivar' : 'Activar'">
              <i :class="emp.activo ? 'fas fa-ban' : 'fas fa-check-circle'"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn-page">Anterior</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="['page-number', { active: page === currentPage }]">
        {{ page }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-page">Siguiente</button>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal">
      <div class="modal-content modal-large">
        <h3>{{ editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado' }}</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Cédula de Identidad</label>
            <input
              v-model="form.cedulaIdentidad"
              placeholder="Cédula de Identidad"
              class="modal-input"
            />
          </div>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.nombre" placeholder="Nombre" class="modal-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Apellido Paterno</label>
            <input
              v-model="form.apellidoPaterno"
              placeholder="Apellido Paterno"
              class="modal-input"
            />
          </div>
          <div class="form-group">
            <label>Apellido Materno</label>
            <input
              v-model="form.apellidoMaterno"
              placeholder="Apellido Materno"
              class="modal-input"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Fecha de Nacimiento</label>
            <input type="date" v-model="form.fechaNacimiento" class="modal-input" />
          </div>
          <div class="form-group">
            <label>Celular</label>
            <input v-model="form.celular" placeholder="Celular" class="modal-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" placeholder="Email" class="modal-input" />
          </div>
          <div class="form-group">
            <label>Cargo</label>
            <input v-model="form.cargo" placeholder="Cargo" class="modal-input" />
          </div>
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input v-model="form.direccion" placeholder="Dirección" class="modal-input" />
        </div>
        <div class="modal-buttons">
          <button @click="save" class="btn-save">Guardar</button>
          <button @click="closeModal" class="btn-cancel-modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { Employee } from '../../types'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchEmployees()
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return adminStore.employees.slice(start, end)
})

const totalPages = computed(() => Math.ceil(adminStore.employees.length / itemsPerPage.value))

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const modalOpen = ref(false)
const editingEmployee = ref<Employee | null>(null)
const form = ref({
  cedulaIdentidad: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  direccion: '',
  celular: '',
  email: '',
  cargo: '',
  activo: true,
})

const openModal = () => {
  editingEmployee.value = null
  form.value = {
    cedulaIdentidad: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    direccion: '',
    celular: '',
    email: '',
    cargo: '',
    activo: true,
  }
  modalOpen.value = true
}

const editEmployee = (employee: Employee) => {
  editingEmployee.value = employee
  const fechaStr = (employee.fechaNacimiento ?
    new Date(employee.fechaNacimiento).toISOString().split('T')[0] : '') || ''
  form.value = { ...employee, fechaNacimiento: fechaStr }
  modalOpen.value = true
}

const save = () => {
  const empleadoData = {
    ...form.value,
    fechaNacimiento: form.value.fechaNacimiento ? new Date(form.value.fechaNacimiento) : new Date(),
  }
  if (editingEmployee.value) {
    adminStore.updateEmployee(editingEmployee.value.id, empleadoData)
  } else {
    adminStore.addEmployee(empleadoData as any)
  }
  closeModal()
}

const toggleStatus = (id: number, currentStatus: boolean) => {
  const newStatus = !currentStatus
  if (confirm(`¿${newStatus ? 'Activar' : 'Desactivar'} este empleado?`)) {
    adminStore.updateEmployee(id, { activo: newStatus })
  }
}

const closeModal = () => {
  modalOpen.value = false
}
</script>

<style scoped>
.manager-container {
  background: #0a0c0f;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-table {
  width: 100%;
  background: #1e2128;
  border-radius: 1rem;
  border-collapse: collapse;
  overflow: hidden;
}

.admin-table th,
.admin-table td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #2a2f38;
}

.admin-table th {
  background: #111316;
  color: #ff7e05;
}

.btn-add {
  background: #22c55e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  cursor: pointer;
  font-weight: bold;
}

.btn-edit {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.3rem;
}

.btn-toggle {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}

.status-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.active {
  background: #22c55e;
  color: white;
}

.status-badge.inactive {
  background: #6b7280;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1e2128;
  padding: 2rem;
  border-radius: 1rem;
  min-width: 500px;
}

.modal-large {
  min-width: 600px;
}

.modal-input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.8rem;
  background: #2c313a;
  border: none;
  border-radius: 8px;
  color: white;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-save {
  background: #22c55e;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel-modal {
  background: #6b7280;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  cursor: pointer;
}

.modal label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ff7e05;
  font-weight: bold;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .admin-table {
    font-size: 0.7rem;
  }

  .modal-content,
  .modal-large {
    min-width: 90%;
    margin: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
}

.btn-page {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-page:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.page-number {
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  background: #2c313a;
  color: white;
}

.page-number.active {
  background: #ff7e05;
  color: black;
}</style>
