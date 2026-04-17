import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, Product, Employee, User, Role, Sale, SaleDetail, SalesReport, CartItem } from '../types'
import { categoriasService } from '../services/categorias.service'
import { productosService } from '../services/productos.service'
import { empleadosService } from '../services/empleados.service'
import { usuariosService } from '../services/usuarios.service'
import { rolesService } from '../services/roles.service'
import { ventasService, type CreateSaleDto } from '../services/ventas.service'

export const useAdminStore = defineStore('admin', () => {
  // ============= ESTADO =============
  const categories = ref<Category[]>([])
  const products = ref<Product[]>([])
  const employees = ref<Employee[]>([])
  const users = ref<User[]>([])
  const roles = ref<Role[]>([])
  const sales = ref<Sale[]>([])
  const saleDetails = ref<SaleDetail[]>([])
  const reports = ref<SalesReport | null>(null)

  // Carrito de compras (POS)
  const cart = ref<CartItem[]>([])
  const currentSale = ref({
    nombreCliente: '',
    documento: '',
    metodoPago: 'efectivo' as const,
    montoPagado: 0,
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============= CATEGORÍAS CRUD =============
  const fetchCategories = async () => {
    loading.value = true
    try {
      categories.value = await categoriasService.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addCategory = async (
    data: Omit<Category, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ) => {
    try {
      const newCategory = await categoriasService.create(data)
      categories.value.push(newCategory)
      return newCategory
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateCategory = async (id: number, data: Partial<Category>) => {
    try {
      const updated = await categoriasService.update(id, data)
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) categories.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      await categoriasService.delete(id)
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) categories.value.splice(index, 1)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // ============= PRODUCTOS CRUD =============
  const fetchProducts = async () => {
    loading.value = true
    try {
      products.value = await productosService.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addProduct = async (
    data:
      | FormData
      | Omit<Product, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ) => {
    try {
      const newProduct = await productosService.create(data)
      products.value.push(newProduct)
      return newProduct
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateProduct = async (id: number, data: Partial<Product>) => {
    try {
      const updated = await productosService.update(id, data)
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) products.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      await productosService.delete(id)
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) products.value.splice(index, 1)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // ============= EMPLEADOS CRUD =============
  const fetchEmployees = async () => {
    loading.value = true
    try {
      employees.value = await empleadosService.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addEmployee = async (
    data: Omit<Employee, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ) => {
    try {
      const newEmployee = await empleadosService.create(data)
      employees.value.push(newEmployee)
      return newEmployee
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateEmployee = async (id: number, data: Partial<Employee>) => {
    try {
      const updated = await empleadosService.update(id, data)
      const index = employees.value.findIndex((e) => e.id === id)
      if (index !== -1) employees.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteEmployee = async (id: number) => {
    try {
      await empleadosService.delete(id)
      const index = employees.value.findIndex((e) => e.id === id)
      if (index !== -1) employees.value.splice(index, 1)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // ============= USUARIOS CRUD =============
  const fetchUsers = async () => {
    loading.value = true
    try {
      users.value = await usuariosService.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addUser = async (
    data: Omit<User, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ) => {
    try {
      const newUser = await usuariosService.create(data)
      users.value.push(newUser)
      return newUser
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      const updated = await usuariosService.update(id, data)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) users.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await usuariosService.delete(id)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) users.value.splice(index, 1)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // ============= ROLES CRUD =============
  const fetchRoles = async () => {
    loading.value = true
    try {
      roles.value = await rolesService.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addRole = async (
    data: Omit<Role, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ) => {
    try {
      const newRole = await rolesService.create(data)
      roles.value.push(newRole)
      return newRole
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateRole = async (id: number, data: Partial<Role>) => {
    try {
      const updated = await rolesService.update(id, data)
      const index = roles.value.findIndex((r) => r.id === id)
      if (index !== -1) roles.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteRole = async (id: number) => {
    try {
      await rolesService.delete(id)
      const index = roles.value.findIndex((r) => r.id === id)
      if (index !== -1) roles.value.splice(index, 1)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // ============= VENTAS CRUD =============
  const fetchSales = async () => {
    loading.value = true
    try {
      sales.value = await ventasService.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchSaleDetails = async (saleId: number) => {
    try {
      const details = await ventasService.getDetalles(saleId)
      // Remover detalles existentes para esta venta
      saleDetails.value = saleDetails.value.filter((d) => d.idVenta !== saleId)
      // Agregar los nuevos detalles
      saleDetails.value.push(...details.map((d) => ({ ...d, idVenta: saleId })))
      return details
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const fetchSalesReport = async () => {
    loading.value = true
    try {
      reports.value = await ventasService.getReports()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // ============= POS (Carrito y Ventas) =============
  const addToCart = (product: Product, cantidad: number = 1) => {
    const existing = cart.value.find((item) => item.productId === product.id)
    if (existing) {
      if (existing.cantidad + cantidad <= product.stock) {
        existing.cantidad += cantidad
        existing.subtotal = existing.cantidad * Number(existing.precioUnitario)
      } else {
        alert(`Stock insuficiente. Solo quedan ${product.stock} unidades`)
      }
    } else {
      if (cantidad <= product.stock) {
        cart.value.push({
          productId: product.id,
          nombre: product.nombre,
          imagen: product.urlImagen || 'https://placehold.co/300x200/2b2b2b/FF7E05?text=🍔',
          cantidad: cantidad,
          precioUnitario: Number(product.precioUnitario),
          subtotal: Number(product.precioUnitario) * cantidad,
          stockDisponible: product.stock,
        })
      } else {
        alert(`Stock insuficiente. Solo quedan ${product.stock} unidades`)
      }
    }
  }

  const removeFromCart = (index: number) => {
    cart.value.splice(index, 1)
  }

  const updateCartQuantity = (index: number, cantidad: number) => {
    const item = cart.value[index]
    if (!item) return
    const product = products.value.find((p) => p.id === item.productId)
    if (product && cantidad <= product.stock) {
      item.cantidad = cantidad
      item.subtotal = cantidad * Number(item.precioUnitario)
    } else {
      alert(`Stock insuficiente. Máximo ${product?.stock} unidades`)
    }
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.subtotal, 0)
  })

  const clearCart = () => {
    cart.value = []
    currentSale.value = {
      nombreCliente: '',
      documento: '',
      metodoPago: 'efectivo',
      montoPagado: 0,
    }
  }

  const createSale = async (usuarioId: number) => {
    if (cart.value.length === 0) {
      alert('No hay productos en el carrito')
      return false
    }

    const total = cartTotal.value
    const cambio = currentSale.value.montoPagado - total

    if (cambio < 0) {
      alert(`El monto pagado es insuficiente. Faltan Bs. ${Math.abs(cambio).toFixed(2)}`)
      return false
    }

    try {
      const saleData: CreateSaleDto = {
        idUsuario: usuarioId,
        metodoPago: currentSale.value.metodoPago,
        detalles: cart.value.map((item) => ({
          idProducto: item.productId,
          cantidad: item.cantidad,
        })),
        montoPagado: currentSale.value.montoPagado,
        cambio: cambio,
        nombreCliente: currentSale.value.nombreCliente || 'Cliente',
        documento: currentSale.value.documento || 'N/A',
      }

      const newSale = await ventasService.create(saleData)
      sales.value.push(newSale)

      // Actualizar stock localmente
      cart.value.forEach((item) => {
        const product = products.value.find((p) => p.id === item.productId)
        if (product) {
          product.stock -= item.cantidad
        }
      })

      clearCart()
      alert(`✅ Venta #${newSale.id} completada. Cambio: Bs. ${cambio.toFixed(2)}`)
      return true
    } catch (err: any) {
      alert(`Error al crear la venta: ${err.message}`)
      return false
    }
  }

  const cancelSale = async (saleId: number) => {
    try {
      await ventasService.softDelete(saleId)
      const sale = sales.value.find((s) => s.id === saleId)
      if (sale) {
        sale.estado = 'anulada'
        sale.fechaAnulacion = new Date()
      }
      alert(`Venta #${saleId} ha sido anulada`)
    } catch (err: any) {
      alert(`Error al anular la venta: ${err.message}`)
    }
  }

  // ============= INICIALIZACIÓN =============
  const init = async () => {
    await Promise.all([
      fetchCategories(),
      fetchProducts(),
      fetchEmployees(),
      fetchUsers(),
      fetchRoles(),
      fetchSales(),
      fetchSalesReport(),
    ])
  }

  return {
    // Estado
    categories,
    products,
    employees,
    users,
    roles,
    sales,
    saleDetails,
    reports,
    cart,
    currentSale,
    cartTotal,
    loading,
    error,

    // Inicialización
    init,

    // CRUD Categorías
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,

    // CRUD Productos
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,

    // CRUD Empleados
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // CRUD Usuarios
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,

    // CRUD Roles
    fetchRoles,
    addRole,
    updateRole,
    deleteRole,

    // CRUD Ventas
    fetchSales,
    fetchSaleDetails,
    fetchSalesReport,
    cancelSale,

    // POS
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createSale,
  }
})
