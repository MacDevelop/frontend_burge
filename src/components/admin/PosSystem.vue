<template>
  <div class="pos-container">
    <!-- Panel de productos -->
    <div class="pos-products">
      <div class="pos-header">
        <h2><i class="fas fa-cash-register"></i> Punto de Venta</h2>
        <input
          type="text"
          v-model="searchProduct"
          placeholder="🔍 Buscar producto..."
          class="search-input"
        />
      </div>
      <div class="product-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="pos-product"
          @click="addToCart(product)"
        >
          <div class="product-image">
            <img
              :src="product.urlImagen || 'https://placehold.co/300x200/2b2b2b/FF7E05?text=🍔'"
              :alt="product.nombre"
            />
            <div v-if="product.stock < 10" class="stock-badge low">Stock: {{ product.stock }}</div>
            <div v-else class="stock-badge">Stock: {{ product.stock }}</div>
          </div>
          <div class="product-info">
            <h4>{{ product.nombre }}</h4>
            <p class="product-price">Bs. {{ Number(product.precioUnitario).toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel del carrito -->
    <div class="pos-cart">
      <h3><i class="fas fa-shopping-basket"></i> Carrito de compras</h3>

      <div class="cart-items">
        <div v-for="(item, idx) in adminStore.cart" :key="idx" class="cart-item">
          <div class="cart-item-image">
            <img :src="item.imagen" :alt="item.nombre" />
          </div>
          <div class="cart-item-details">
            <div class="item-name">{{ item.nombre }}</div>
            <div class="item-price">Bs. {{ item.precioUnitario.toFixed(2) }}</div>
            <div class="item-controls">
              <button @click="updateCartQuantity(idx, item.cantidad - 1)" class="qty-btn">-</button>
              <span class="item-qty">{{ item.cantidad }}</span>
              <button @click="updateCartQuantity(idx, item.cantidad + 1)" class="qty-btn">+</button>
              <span class="item-subtotal">Bs. {{ item.subtotal.toFixed(2) }}</span>
              <button @click="removeFromCart(idx)" class="remove-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-if="adminStore.cart.length === 0" class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Carrito vacío</p>
          <span>Selecciona productos para comenzar</span>
        </div>
      </div>

      <div class="cart-total">
        <span>Total:</span>
        <strong>Bs. {{ adminStore.cartTotal.toFixed(2) }}</strong>
      </div>

      <div class="customer-info">
        <input
          type="text"
          v-model="adminStore.currentSale.nombreCliente"
          placeholder="Nombre del cliente"
          class="customer-input"
        />
        <input
          type="text"
          v-model="adminStore.currentSale.documento"
          placeholder="Documento (CI/NIT)"
          class="customer-input"
        />
        <select v-model="adminStore.currentSale.metodoPago" class="customer-input">
          <option value="efectivo">💵 Efectivo</option>
          <option value="qr">📱 QR</option>
        </select>
        <input
          type="number"
          v-model="adminStore.currentSale.montoPagado"
          placeholder="Monto pagado"
          class="customer-input"
          step="0.01"
        />
        <div
          v-if="adminStore.currentSale.montoPagado > 0"
          class="cambio-info"
          :class="{ insufficient: cambio < 0 }"
        >
          Cambio: Bs. {{ cambio.toFixed(2) }}
        </div>
      </div>

      <button @click="createSale" class="btn-finalizar" :disabled="adminStore.cart.length === 0">
        <i class="fas fa-check-circle"></i> Finalizar Venta
      </button>
      <button @click="adminStore.clearCart()" class="btn-clear" v-if="adminStore.cart.length > 0">
        <i class="fas fa-trash-alt"></i> Limpiar Carrito
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useAuthStore } from '../../stores/auth'
import type { Product } from '../../types'

const adminStore = useAdminStore()
const authStore = useAuthStore()
const searchProduct = ref('')

const filteredProducts = computed(() => {
  if (!searchProduct.value) return adminStore.products.filter((p) => !p.fechaEliminacion)
  return adminStore.products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchProduct.value.toLowerCase()) && !p.fechaEliminacion,
  )
})

const cambio = computed(() => {
  return adminStore.currentSale.montoPagado - adminStore.cartTotal
})

const addToCart = (product: Product) => {
  if (product.stock > 0) {
    adminStore.addToCart(product)
  } else {
    alert('Producto sin stock')
  }
}

const removeFromCart = (index: number) => {
  adminStore.removeFromCart(index)
}

const updateCartQuantity = (index: number, cantidad: number) => {
  if (cantidad > 0) {
    adminStore.updateCartQuantity(index, cantidad)
  } else if (cantidad === 0) {
    adminStore.removeFromCart(index)
  }
}

const createSale = () => {
  adminStore.createSale(authStore.user?.id || 1)
}
</script>

<style scoped>
.pos-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  height: calc(100vh - 100px);
}

.pos-products {
  background: #1e2128;
  border-radius: 1rem;
  padding: 1rem;
  overflow-y: auto;
}

.pos-header {
  margin-bottom: 1rem;
}

.pos-header h2 {
  margin-bottom: 0.5rem;
  color: #ff7e05;
}

.search-input {
  width: 100%;
  padding: 0.8rem;
  background: #2c313a;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border: 1px solid #ff7e05;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.pos-product {
  background: #2c313a;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.pos-product:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(255, 126, 5, 0.3);
}

.product-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  color: white;
}

.stock-badge.low {
  background: #f59e0b;
}

.product-info {
  padding: 0.8rem;
  text-align: center;
}

.product-info h4 {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.product-price {
  color: #ff7e05;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Carrito */
.pos-cart {
  background: #1e2128;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pos-cart h3 {
  color: #ff7e05;
  border-bottom: 1px solid #2c313a;
  padding-bottom: 0.5rem;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.cart-item {
  display: flex;
  gap: 0.8rem;
  background: #2c313a;
  padding: 0.6rem;
  border-radius: 0.8rem;
  margin-bottom: 0.5rem;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
}

.item-name {
  font-weight: bold;
  font-size: 0.9rem;
}

.item-price {
  color: #ff7e05;
  font-size: 0.8rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.qty-btn {
  background: #ff7e05;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  color: #1a1a1a;
}

.item-qty {
  min-width: 30px;
  text-align: center;
}

.item-subtotal {
  margin-left: auto;
  font-weight: bold;
  color: #22c55e;
}

.remove-btn {
  background: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  color: white;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-cart i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.empty-cart span {
  font-size: 0.8rem;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  padding: 0.8rem;
  background: #2c313a;
  border-radius: 0.8rem;
  font-weight: bold;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.customer-input {
  padding: 0.8rem;
  background: #2c313a;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 0.9rem;
}

.customer-input:focus {
  outline: none;
  border: 1px solid #ff7e05;
}

.cambio-info {
  text-align: center;
  padding: 0.5rem;
  border-radius: 40px;
  background: #22c55e20;
  color: #22c55e;
  font-weight: bold;
}

.cambio-info.insufficient {
  background: #dc262620;
  color: #dc2626;
}

.btn-finalizar {
  background: #ff7e05;
  border: none;
  padding: 1rem;
  border-radius: 40px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s;
}

.btn-finalizar:hover:not(:disabled) {
  background: #e56f00;
  transform: scale(1.02);
}

.btn-finalizar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear {
  background: #6b7280;
  border: none;
  padding: 0.8rem;
  border-radius: 40px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-clear:hover {
  background: #4b5563;
}

@media (max-width: 768px) {
  .pos-container {
    grid-template-columns: 1fr;
    height: auto;
  }

  .cart-items {
    max-height: 250px;
  }
}
</style>
