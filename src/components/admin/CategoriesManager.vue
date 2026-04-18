<template>
  <div class="manager-container">
    <div class="section-header">
      <h2><i class="fas fa-tags"></i> Categorías</h2>
      <button @click="openModal" class="btn-add">
        <i class="fas fa-plus"></i> Nueva Categoría
      </button>
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
        <tr v-for="cat in paginatedCategories" :key="cat.id">
          <td>{{ cat.id }}</td>
          <td>{{ cat.nombre }}</td>
          <td>{{ cat.descripcion }}</td>
          <td>
            <span :class="['status-badge', cat.fechaEliminacion ? 'deleted' : 'active']">
              {{ cat.fechaEliminacion ? 'Eliminado' : 'Activo' }}
            </span>
          </td>
          <td>
            <button @click="editCategory(cat)" class="btn-edit" title="Editar"><i class="fas fa-edit"></i></button>
            <button
              v-if="!cat.fechaEliminacion"
              @click="deleteCategory(cat.id)"
              class="btn-delete"
              title="Eliminar"
            >
              <i class="fas fa-trash"></i>
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
      <div class="modal-content">
        <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="form.nombre" placeholder="Nombre" class="modal-input" />
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
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { Category } from '../../types'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchCategories()
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const activeCategories = computed(() => adminStore.categories.filter((c) => !c.fechaEliminacion))

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return activeCategories.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(activeCategories.value.length / itemsPerPage.value))

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
const editingCategory = ref<Category | null>(null)
const form = ref({ nombre: '', descripcion: '' })

const openModal = () => {
  editingCategory.value = null
  form.value = { nombre: '', descripcion: '' }
  modalOpen.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  form.value = { nombre: category.nombre, descripcion: category.descripcion }
  modalOpen.value = true
}

const save = () => {
  if (editingCategory.value) {
    adminStore.updateCategory(editingCategory.value.id, form.value)
  } else {
    adminStore.addCategory(form.value as any)
  }
  closeModal()
}

const deleteCategory = (id: number) => {
  if (confirm('¿Eliminar esta categoría?')) {
    adminStore.deleteCategory(id)
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

@media (max-width: 768px) {
  .admin-table {
    font-size: 0.8rem;
  }

  .modal-content {
    min-width: 90%;
    margin: 1rem;
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
}
</style>
