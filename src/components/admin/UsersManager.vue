<template>
  <div class="manager-container">
    <div class="section-header">
      <h2><i class="fas fa-user-shield"></i> Usuarios del Sistema</h2>
      <button @click="openModal" class="btn-add"><i class="fas fa-plus"></i> Nuevo Usuario</button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Empleado</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in activeUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.nombreUsuario }}</td>
          <td>{{ user.email }}</td>
          <td>{{ getRoleName(user.idRol) }}</td>
          <td>{{ getEmployeeName(user.idEmpleado) }}</td>
          <td>
            <span :class="['status-badge', user.fechaEliminacion ? 'deleted' : 'active']">
              {{ user.fechaEliminacion ? 'Eliminado' : 'Activo' }}
            </span>
          </td>
          <td>
            <button @click="editUser(user)" class="btn-edit" title="Editar"><i class="fas fa-eye"></i></button>
            <button v-if="!user.fechaEliminacion" @click="deleteUser(user.id)" class="btn-delete" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
        <div class="form-group">
          <label>Nombre de Usuario</label>
          <input v-model="form.nombreUsuario" placeholder="Nombre de Usuario" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" placeholder="Email" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" v-model="form.clave" placeholder="Contraseña" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Rol</label>
          <select v-model="form.idRol" class="modal-input">
            <option :value="0">Seleccionar Rol</option>
            <option v-for="role in activeRoles" :key="role.id" :value="role.id">
              {{ role.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Empleado</label>
          <select v-model="form.idEmpleado" class="modal-input">
            <option :value="0">Seleccionar Empleado</option>
            <option v-for="emp in activeEmployees" :key="emp.id" :value="emp.id">
              {{ emp.nombre }} {{ emp.apellidoPaterno }}
            </option>
          </select>
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
import { ref, computed } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { User } from '../../types'

const adminStore = useAdminStore()

const activeUsers = computed(() => adminStore.users.filter((u) => !u.fechaEliminacion))
const activeRoles = computed(() => adminStore.roles.filter((r) => !r.fechaEliminacion))
const activeEmployees = computed(() => adminStore.employees.filter((e) => e.activo))

const modalOpen = ref(false)
const editingUser = ref<User | null>(null)
const form = ref({
  nombreUsuario: '',
  email: '',
  clave: '',
  idRol: 0,
  idEmpleado: 0,
})

const getRoleName = (id: number) => {
  const role = adminStore.roles.find((r) => r.id === id)
  return role?.nombre || 'Sin rol'
}

const getEmployeeName = (id: number) => {
  const emp = adminStore.employees.find((e) => e.id === id)
  return emp ? `${emp.nombre} ${emp.apellidoPaterno}` : 'Sin empleado'
}

const openModal = () => {
  editingUser.value = null
  form.value = { nombreUsuario: '', email: '', clave: '', idRol: 0, idEmpleado: 0 }
  modalOpen.value = true
}

const editUser = (user: User) => {
  editingUser.value = user
  form.value = {
    nombreUsuario: user.nombreUsuario,
    email: user.email,
    clave: '',
    idRol: user.idRol,
    idEmpleado: user.idEmpleado,
  }
  modalOpen.value = true
}

const save = () => {
  if (editingUser.value) {
    const updateData: any = { ...form.value }
    if (!updateData.clave) delete updateData.clave
    adminStore.updateUser(editingUser.value.id, updateData)
  } else {
    if (!form.value.clave) {
      alert('La contraseña es requerida')
      return
    }
    adminStore.addUser(form.value as any)
  }
  closeModal()
}

const deleteUser = (id: number) => {
  if (confirm('¿Eliminar este usuario?')) {
    adminStore.deleteUser(id)
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

.btn-delete {
  background: #dc2626;
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

.status-badge.deleted {
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
  min-width: 400px;
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
</style>
