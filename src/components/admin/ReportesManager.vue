<template>
  <div class="reportes-container">
    <div class="section-header">
      <h2><i class="fas fa-file-alt"></i> Reportes de Ventas</h2>
      <button class="btn-refresh" @click="fetchReportes">
        <i class="fas fa-sync-alt"></i> Actualizar
      </button>
    </div>

    <div v-if="!reportes" class="empty-state">
      <p>Cargando resumen de ventas...</p>
    </div>

    <div v-else class="report-cards">
      <div class="report-card">
        <div class="card-icon daily">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div>
          <p class="card-title">Ingresos diarios</p>
          <p class="card-value">Bs. {{ formatoMoneda(reportes.diario.totalIngresos) }}</p>
          <p class="card-subtitle">Ventas realizadas: {{ reportes.diario.ventasRealizadas }}</p>
        </div>
      </div>

      <div class="report-card">
        <div class="card-icon monthly">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div>
          <p class="card-title">Ingresos mensuales</p>
          <p class="card-value">Bs. {{ formatoMoneda(reportes.mensual.totalIngresos) }}</p>
          <p class="card-subtitle">Ventas realizadas: {{ reportes.mensual.ventasRealizadas }}</p>
        </div>
      </div>

      <div class="report-card">
        <div class="card-icon best-seller">
          <i class="fas fa-hamburger"></i>
        </div>
        <div>
          <p class="card-title">Hamburguesa más vendida hoy</p>
          <p class="card-value">{{ reportes.diario.hamburguesaMasVendida.nombre }}</p>
          <p class="card-subtitle">Cantidad: {{ reportes.diario.hamburguesaMasVendida.cantidadVendida }}</p>
        </div>
      </div>

      <div class="report-card">
        <div class="card-icon best-seller-month">
          <i class="fas fa-hamburger"></i>
        </div>
        <div>
          <p class="card-title">Hamburguesa más vendida este mes</p>
          <p class="card-value">{{ reportes.mensual.hamburguesaMasVendida.nombre }}</p>
          <p class="card-subtitle">Cantidad: {{ reportes.mensual.hamburguesaMasVendida.cantidadVendida }}</p>
        </div>
      </div>
    </div>

    <div v-if="reportes" class="details-grid">
      <div class="detail-panel">
        <h3>Resumen diario</h3>
        <ul>
          <li><strong>Total ingresos:</strong> Bs. {{ formatoMoneda(reportes.diario.totalIngresos) }}</li>
          <li><strong>Ventas realizadas:</strong> {{ reportes.diario.ventasRealizadas }}</li>
          <li><strong>Hamburguesa líder:</strong> {{ reportes.diario.hamburguesaMasVendida.nombre }}</li>
          <li><strong>Cantidad vendida:</strong> {{ reportes.diario.hamburguesaMasVendida.cantidadVendida }}</li>
        </ul>
      </div>
      <div class="detail-panel">
        <h3>Resumen mensual</h3>
        <ul>
          <li><strong>Total ingresos:</strong> Bs. {{ formatoMoneda(reportes.mensual.totalIngresos) }}</li>
          <li><strong>Ventas realizadas:</strong> {{ reportes.mensual.ventasRealizadas }}</li>
          <li><strong>Hamburguesa líder:</strong> {{ reportes.mensual.hamburguesaMasVendida.nombre }}</li>
          <li><strong>Cantidad vendida:</strong> {{ reportes.mensual.hamburguesaMasVendida.cantidadVendida }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

const reportes = computed(() => adminStore.reports)

const fetchReportes = async () => {
  await adminStore.fetchSalesReport()
}

const formatoMoneda = (value: number) => {
  return value.toFixed(2)
}

onMounted(() => {
  fetchReportes()
})
</script>

<style scoped>
.reportes-container {
  background: #0a0c0f;
  padding: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-refresh {
  background: #ff7e05;
  border: none;
  color: #1a1a1a;
  padding: 0.8rem 1rem;
  border-radius: 0.85rem;
  cursor: pointer;
  font-weight: bold;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #f5ede8;
  background: #111316;
  border-radius: 1rem;
}

.report-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.report-card {
  background: #1e2128;
  border-radius: 1.2rem;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  color: #fff;
}

.card-icon.daily { background: #0ea5e9; }
.card-icon.monthly { background: #8b5cf6; }
.card-icon.best-seller { background: #f97316; }
.card-icon.best-seller-month { background: #dc2626; }

.card-title {
  color: #9ca3af;
  margin: 0;
  font-size: 0.9rem;
}

.card-value {
  margin: 0.4rem 0 0;
  font-size: 1.35rem;
  font-weight: 700;
}

.card-subtitle {
  margin: 0.25rem 0 0;
  color: #d1d5db;
  font-size: 0.9rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.detail-panel {
  background: #111316;
  border-radius: 1rem;
  padding: 1.3rem;
}

.detail-panel h3 {
  margin-bottom: 1rem;
  color: #ff7e05;
}

.detail-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-panel li {
  margin-bottom: 0.75rem;
  color: #e5e7eb;
}

.detail-panel strong {
  color: #f8fafc;
}
</style>
