<template>
  <div class="manager-container">
    <div class="section-header">
      <h2><i class="fas fa-hamburger"></i> Productos</h2>
      <button @click="openModal" class="btn-add"><i class="fas fa-plus"></i> Nuevo Producto</button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in activeProducts" :key="product.id">
          <td>{{ product.id }}</td>
          <td class="product-img-cell">
            <img
              :src="product.urlImagen || 'https://placehold.co/50x50/2b2b2b/FF7E05?text=🍔'"
              class="product-thumb"
            />
          </td>
          <td>{{ product.nombre }}</td>
          <td>{{ getCategoryName(product.idCategoria) }}</td>
          <td>${{ (Number(product.precioUnitario) || 0).toFixed(2) }}</td>
          <td :class="{ 'low-stock': product.stock < 10 }">{{ product.stock }}</td>
          <td>
            <span :class="['status-badge', product.fechaEliminacion ? 'deleted' : 'active']">
              {{ product.fechaEliminacion ? 'Eliminado' : 'Activo' }}
            </span>
          </td>
          <td>
            <button @click="editProduct(product)" class="btn-edit" title="Editar">
              <i class="fas fa-eye"></i>
            </button>
            <button
              v-if="!product.fechaEliminacion"
              @click="deleteProduct(product.id)"
              class="btn-delete"
              title="Eliminar"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
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
        <div class="form-group">
          <label>Precio</label>
          <input
            type="number"
            v-model="form.precioUnitario"
            placeholder="Precio"
            class="modal-input"
            step="0.01"
          />
        </div>
        <div class="form-group">
          <label>Stock</label>
          <input type="number" v-model="form.stock" placeholder="Stock" class="modal-input" />
        </div>
        <div class="form-group">
          <label>URL de la imagen</label>
          <input v-model="form.urlImagen" placeholder="URL de la imagen" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select v-model="form.idCategoria" class="modal-input">
            <option :value="0">Seleccionar categoría</option>
            <option v-for="cat in activeCategories" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
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
import type { Product } from '../../types'

const adminStore = useAdminStore()

const activeProducts = computed(() => adminStore.products.filter((p) => !p.fechaEliminacion))
const activeCategories = computed(() => adminStore.categories.filter((c) => !c.fechaEliminacion))

const modalOpen = ref(false)
const editingProduct = ref<Product | null>(null)
const form = ref({
  nombre: '',
  descripcion: '',
  precioUnitario: 0,
  stock: 0,
  urlImagen: '',
  idCategoria: 0,
})

const getCategoryName = (id: number) => {
  const cat = adminStore.categories.find((c) => c.id === id)
  return cat?.nombre || 'Sin categoría'
}

const openModal = () => {
  editingProduct.value = null
  form.value = {
    nombre: '',
    descripcion: '',
    precioUnitario: 0,
    stock: 0,
    urlImagen: '',
    idCategoria: 0,
  }
  modalOpen.value = true
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  form.value = { ...product }
  modalOpen.value = true
}

const save = () => {
  if (editingProduct.value) {
    adminStore.updateProduct(editingProduct.value.id, form.value)
  } else {
    adminStore.addProduct(form.value as any)
  }
  closeModal()
}

const deleteProduct = (id: number) => {
  if (confirm('¿Eliminar este producto?')) {
    adminStore.deleteProduct(id)
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

.product-img-cell {
  width: 60px;
}

.product-thumb {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  object-fit: cover;
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

.low-stock {
  color: #f59e0b;
  font-weight: bold;
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
  min-width: 450px;
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
</style>
