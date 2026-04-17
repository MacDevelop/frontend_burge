// ============= ROLES =============
export interface Role {
  id: number
  nombre: string
  descripcion: string
  fechaCreacion: Date
  fechaModificacion: Date
  fechaEliminacion: Date | null
}

// ============= EMPLEADOS =============
export interface Employee {
  id: number
  cedulaIdentidad: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  fechaNacimiento: Date
  direccion: string
  celular: string
  email: string
  cargo: string
  activo: boolean
  fechaCreacion: Date
  fechaModificacion: Date
  fechaEliminacion: Date | null
}

// ============= USUARIOS =============
export interface User {
  id: number
  idRol: number
  rol?: Role
  idEmpleado: number
  empleado?: Employee
  nombreUsuario: string
  email: string
  clave: string
  fechaCreacion: Date
  fechaModificacion: Date
  fechaEliminacion: Date | null
}

// ============= CATEGORIAS =============
export interface Category {
  id: number
  nombre: string
  descripcion: string
  fechaCreacion: Date
  fechaModificacion: Date
  fechaEliminacion: Date | null
}

// ============= PRODUCTOS =============
export interface Product {
  id: number
  nombre: string
  descripcion: string
  precioUnitario: number
  stock: number
  urlImagen: string
  idCategoria: number
  categoria?: Category
  fechaCreacion: Date
  fechaModificacion: Date
  fechaEliminacion: Date | null
}

// ============= VENTAS =============
export interface Sale {
  id: number
  totalVenta: number
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr'
  estado: 'vigente' | 'anulada' | 'completada'
  fechaCreacion: Date
  fechaEliminacion: Date | null
  fechaAnulacion: Date | null
  montoPagado: number
  cambio: number
  nombreCliente: string
  documento: string
  idUsuario: number
  usuario?: User
  ventadetalles?: SaleDetail[]
}

export interface SalesReportSummary {
  totalIngresos: number
  ventasRealizadas: number
  hamburguesaMasVendida: {
    nombre: string
    cantidadVendida: number
    totalVendido: number
  }
}

export interface SalesReport {
  diario: SalesReportSummary
  mensual: SalesReportSummary
}

// ============= DETALLE_VENTAS =============
export interface SaleDetail {
  id: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  fechaCreacion: Date
  fechaAnulacion: Date | null
  fechaEliminacion: Date | null
  idVenta: number
  venta?: Sale
  idProducto: number
  producto?: Product
}

// ============= Tipos auxiliares =============
export interface CartItem {
  productId: number
  nombre: string
  imagen: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  stockDisponible: number
}
