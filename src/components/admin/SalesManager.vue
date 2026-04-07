<template>
  <div class="manager-container">
    <div class="section-header">
      <h2><i class="fas fa-chart-line"></i> Historial de Ventas</h2>
      <div class="stats-cards">
        <div class="stat-card">
          <i class="fas fa-dollar-sign"></i>
          <div class="stat-number">Bs. {{ totalVentasHoy.toFixed(2) }}</div>
          <div class="stat-label">Ventas hoy</div>
        </div>
        <div class="stat-card">
          <i class="fas fa-chart-simple"></i>
          <div class="stat-number">{{ ventasHoy.length }}</div>
          <div class="stat-label">Pedidos hoy</div>
        </div>
      </div>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Documento</th>
          <th>Total</th>
          <th>Método</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in paginatedSales" :key="sale.id">
          <td>#{{ sale.id }}</td>
          <td>{{ sale.nombreCliente }}</td>
          <td>{{ sale.documento }}</td>
          <td>Bs. {{ sale.totalVenta.toFixed(2) }}</td>
          <td>{{ getMetodoPagoIcon(sale.metodoPago) }}</td>
          <td>
            <span :class="['status-badge', sale.estado]">{{ sale.estado }}</span>
          </td>
          <td>{{ formatDate(sale.fechaCreacion) }}</td>
          <td>
            <button @click="viewDetails(sale)" class="btn-view" title="Ver Detalles">
              <i class="fas fa-eye"></i>
            </button>
            <button
              v-if="sale.estado !== 'anulada'"
              @click="cancelSale(sale.id)"
              class="btn-cancel"
              title="Anular Venta"
            >
              <i class="fas fa-ban"></i>
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

    <!-- Modal de detalles -->
    <div v-if="modalOpen" class="modal">
      <div class="modal-content modal-large">
        <h3>Detalles de Venta #{{ selectedSale?.id }}</h3>
        <div class="sale-info">
          <p><strong>Cliente:</strong> {{ selectedSale?.nombreCliente }}</p>
          <p><strong>Documento:</strong> {{ selectedSale?.documento }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(selectedSale?.fechaCreacion) }}</p>
          <p><strong>Método de pago:</strong> {{ getMetodoPagoIcon(selectedSale?.metodoPago) }}</p>
          <p><strong>Total:</strong> Bs. {{ selectedSale?.totalVenta.toFixed(2) }}</p>
          <p><strong>Monto pagado:</strong> Bs. {{ selectedSale?.montoPagado.toFixed(2) }}</p>
          <p><strong>Cambio:</strong> Bs. {{ selectedSale?.cambio.toFixed(2) }}</p>
        </div>
        <h4>Productos</h4>
        <table class="detail-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in saleDetails" :key="detail.id">
              <td>{{ detail.producto?.nombre || 'Producto desconocido' }}</td>
              <td>{{ detail.cantidad }}</td>
              <td>Bs. {{ (Number(detail.precioUnitario) || 0).toFixed(2) }}</td>
              <td>Bs. {{ (Number(detail.subtotal) || 0).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="modal-buttons">
          <button @click="closeModal" class="btn-cancel-modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { Sale, SaleDetail } from '../../types'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchSales()
  adminStore.fetchProducts()
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const modalOpen = ref(false)
const selectedSale = ref<Sale | null>(null)
const saleDetails = ref<SaleDetail[]>([])

const ventasHoy = computed(() => {
  const hoy = new Date().toDateString()
  return adminStore.sales.filter(
    (s) => new Date(s.fechaCreacion).toDateString() === hoy && s.estado !== 'anulada',
  )
})

const totalVentasHoy = computed(() => {
  return ventasHoy.value.reduce((sum, sale) => sum + sale.totalVenta, 0)
})

const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return adminStore.sales.slice(start, end)
})

const totalPages = computed(() => Math.ceil(adminStore.sales.length / itemsPerPage.value))

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const getMetodoPagoIcon = (metodo: string | undefined) => {
  if (!metodo) return ''
  const icons: Record<string, string> = {
    efectivo: '💵 Efectivo',
    tarjeta: '💳 Tarjeta',
    transferencia: '🏦 Transferencia',
    qr: '📱 QR',
  }
  return icons[metodo] || metodo
}

const formatDate = (date: Date | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const viewDetails = async (sale: Sale) => {
  selectedSale.value = sale
  try {
    await adminStore.fetchSaleDetails(sale.id)
    saleDetails.value = adminStore.saleDetails.filter((d) => d.idVenta === sale.id)
    modalOpen.value = true
  } catch (error) {
    console.error('Error al cargar detalles de venta:', error)
    // Opcional: mostrar mensaje de error al usuario
  }
}

const cancelSale = (saleId: number) => {
  if (confirm('¿Estás seguro de anular esta venta?')) {
    adminStore.cancelSale(saleId)
  }
}

const closeModal = () => {
  modalOpen.value = false
  selectedSale.value = null
  saleDetails.value = []
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

.stats-cards {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: #1e2128;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  text-align: center;
  min-width: 150px;
}

.stat-card i {
  font-size: 1.5rem;
  color: #ff7e05;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.stat-label {
  font-size: 0.8rem;
  color: #aaa;
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

.status-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.completada,
.status-badge.vigente {
  background: #22c55e;
  color: white;
}

.status-badge.anulada {
  background: #dc2626;
  color: white;
}

.btn-view {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.3rem;
}

.btn-cancel {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
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
  max-width: 700px;
}

.modal-large {
  min-width: 600px;
}

.sale-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #2c313a;
  border-radius: 0.5rem;
}

.detail-table {
  width: 100%;
  background: #2c313a;
  border-radius: 0.5rem;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.detail-table th,
.detail-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #1e2128;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-cancel-modal {
  background: #6b7280;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  cursor: pointer;
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

  .sale-info {
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
}
</style>
