<template>
  <div class="manager-container">
    <div class="section-header">
      <h2><i class="fas fa-hamburger"></i> Productos</h2>
      <button v-if="canManageProducts" @click="openModal" class="btn-add"><i class="fas fa-plus"></i> Nuevo Producto</button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>#</th>
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
        <tr v-for="(product, index) in paginatedProducts" :key="product.id">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td class="product-img-cell">
            <img
              :src="product.urlImagen || 'https://placehold.co/50x50/2b2b2b/FF7E05?text=🍔'"
              class="product-thumb"
            />
          </td>
          <td>{{ product.nombre }}</td>
          <td>{{ product.categoria?.nombre || 'Sin categoría' }}</td>
          <td>Bs. {{ (Number(product.precioUnitario) || 0).toFixed(2) }}</td>
          <td :class="{ 'low-stock': product.stock < 10 }">{{ product.stock }}</td>
          <td>
            <span :class="['status-badge', product.fechaEliminacion ? 'deleted' : 'active']">
              {{ product.fechaEliminacion ? 'Eliminado' : 'Activo' }}
            </span>
          </td>
          <td>
            <button v-if="canManageProducts" @click="editProduct(product)" class="btn-edit" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button
              v-if="!product.fechaEliminacion && canUpdateStock"
              @click="openStockModal(product)"
              class="btn-stock"
              title="Actualizar Stock"
            >
              <i class="fas fa-boxes"></i>
            </button>
            <button
              v-if="!product.fechaEliminacion && canManageProducts"
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

    <!-- Paginación -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn-page">Anterior</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="['page-number', { active: page === currentPage }]">
        {{ page }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-page">Siguiente</button>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" :key="editingProduct?.id || 'new'" class="modal">
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
        <!-- Subir imagen (único input visible) -->
      <div class="flex items-center gap-4 mb-4">
        <label for="imagenFile" class="font-semibold w-3">Imagen</label>
        <input ref="fileInputRef" id="imagenFile" type="file" accept="image/*" @change="onFileChange" />
      </div>

      <!-- Previsualización si ya hay URL (creación o edición) -->
      <div v-if="form.urlImagen" class="mb-4">
        <img
          :src="form.urlImagen"
          alt="imagen producto"
          style="width: 120px; border-radius: 6px"
        />
      </div>
        <div class="form-group">
          <label>Categoría</label>
          <select v-model="form.idCategoria" :key="editingProduct?.id || 'new'" class="modal-input">
            <option :value="0">Seleccionar categoría</option>
            <option v-for="cat in optionsCategories" :key="cat.id" :value="cat.id">
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

    <!-- Modal Actualizar Stock -->
    <div v-if="stockModalOpen" class="modal">
      <div class="modal-content">
        <h3>Actualizar Stock - {{ editingStockProduct?.nombre }}</h3>
        <div class="form-group">
          <label>Stock Actual: {{ editingStockProduct?.stock }}</label>
          <input
            type="number"
            v-model.number="newStock"
            placeholder="Nuevo stock"
            class="modal-input"
            min="0"
          />
        </div>
        <div class="modal-buttons">
          <button @click="saveStock" class="btn-save">Actualizar</button>
          <button @click="closeStockModal" class="btn-cancel-modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import type { Product } from '../../types'

const adminStore = useAdminStore()
const authStore = useAuthStore()

const canManageProducts = computed(() => authStore.isAdmin)
const canUpdateStock = computed(() => authStore.isAdmin || authStore.isCajero)

onMounted(() => {
  adminStore.fetchProducts()
  adminStore.fetchCategories()
})

const activeProducts = computed(() => adminStore.products.filter((p) => !p.fechaEliminacion))
const activeCategories = computed(() => adminStore.categories.filter((c) => !c.fechaEliminacion))

const currentPage = ref(1)
const itemsPerPage = ref(5)

const optionsCategories = computed(() => {
  const active = adminStore.categories.filter(c => !c.fechaEliminacion)
  if (editingProduct.value && editingProduct.value.idCategoria) {
    const cat = adminStore.categories.find(c => c.id === editingProduct.value.idCategoria)
    if (cat && !active.find(a => a.id === cat.id)) {
      active.push(cat)
    }
  }
  return active
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return activeProducts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(activeProducts.value.length / itemsPerPage.value))

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
const stockModalOpen = ref(false)
const editingProduct = ref<Product | null>(null)
const editingStockProduct = ref<Product | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const newStock = ref(0)
const form = ref({
  nombre: '',
  descripcion: '',
  precioUnitario: 0,
  stock: 0,
  urlImagen: '',
  idCategoria: 0,
})

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
  form.value = {
    ...product,
    idCategoria: product.idCategoria ?? product.categoria?.id ?? 0,
    urlImagen: product.urlImagen || '',
  }
  modalOpen.value = true
}

const save = async () => {
  try {
    if (editingProduct.value) {
      await adminStore.updateProduct(editingProduct.value.id, form.value)
    } else {
      await adminStore.addProduct(form.value as any)
    }
    closeModal()
  } catch (err: any) {
    console.error('Error guardando producto:', err)
    alert(err?.response?.data?.message || err?.message || 'No se pudo guardar el producto')
  }
}

const deleteProduct = (id: number) => {
  if (confirm('¿Eliminar este producto?')) {
    adminStore.deleteProduct(id)
  }
}

const openStockModal = (product: Product) => {
  editingStockProduct.value = product
  newStock.value = product.stock
  stockModalOpen.value = true
}

const closeStockModal = () => {
  stockModalOpen.value = false
  editingStockProduct.value = null
  newStock.value = 0
}

const saveStock = async () => {
  if (!editingStockProduct.value) return

  try {
    await adminStore.updateProductStock(editingStockProduct.value.id, newStock.value)
    closeStockModal()
  } catch (err: any) {
    console.error('Error actualizando stock:', err)
    alert(err?.response?.data?.message || err?.message || 'No se pudo actualizar el stock')
  }
}

const closeModal = () => {
  modalOpen.value = false
  // Limpiar el input de file
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  console.log('Archivo seleccionado:', file)

  if (!file) return

  const fd = new FormData()
  fd.append('file', file)

  try {
    const { data } = await api.post('/uploads', fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Respuesta del backend:', data)

    if (data?.url) {
      form.value.urlImagen = data.url
    }

    // Limpiar el input de file después de la carga
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } catch (err: any) {
    console.error('Error al subir imagen:', err)
    console.error('Detalles:', err.response?.data)
    alert('No se pudo subir la imagen')
    // Limpiar el input incluso en caso de error
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
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

.btn-stock {
  background: #f59e0b;
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
