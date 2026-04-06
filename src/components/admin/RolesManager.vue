<template>
  <div class="manager-container">
    <div class="section-header">
      <h2><i class="fas fa-key"></i> Roles</h2>
      <button @click="openModal" class="btn-add"><i class="fas fa-plus"></i> Nuevo Rol</button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in activeRoles" :key="role.id">
          <td>{{ role.id }}</td>
          <td>{{ role.nombre }}</td>
          <td>{{ role.descripcion }}</td>
          <td>
            <span :class="['status-badge', role.fechaEliminacion ? 'deleted' : 'active']">
              {{ role.fechaEliminacion ? 'Eliminado' : 'Activo' }}
            </span>
          </td>
          <td>
            <button @click="editRole(role)" class="btn-edit" title="Editar"><i class="fas fa-eye"></i></button>
            <button v-if="!role.fechaEliminacion" @click="deleteRole(role.id)" class="btn-delete" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ editingRole ? 'Editar Rol' : 'Nuevo Rol' }}</h3>
        <div class="form-group">
          <label>Nombre del Rol</label>
          <input v-model="form.nombre" placeholder="Nombre del Rol" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea
            v-model="form.descripcion"
            placeholder="Descripción"
            class="modal-input"
            rows="3"
          ></textarea>
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
import type { Role } from '../../types'

const adminStore = useAdminStore()

const activeRoles = computed(() => adminStore.roles.filter((r) => !r.fechaEliminacion))

const modalOpen = ref(false)
const editingRole = ref<Role | null>(null)
const form = ref({ nombre: '', descripcion: '' })

const openModal = () => {
  editingRole.value = null
  form.value = { nombre: '', descripcion: '' }
  modalOpen.value = true
}

const editRole = (role: Role) => {
  editingRole.value = role
  form.value = { nombre: role.nombre, descripcion: role.descripcion }
  modalOpen.value = true
}

const save = () => {
  if (editingRole.value) {
    adminStore.updateRole(editingRole.value.id, form.value)
  } else {
    adminStore.addRole(form.value as any)
  }
  closeModal()
}

const deleteRole = (id: number) => {
  if (confirm('¿Eliminar este rol?')) {
    adminStore.deleteRole(id)
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
