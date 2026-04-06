import api from './api'
import type { Sale, SaleDetail } from '../types'

export interface CreateSaleDto {
  idUsuario: number
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr'
  detalles: Array<{
    idProducto: number
    cantidad: number
  }>
  montoPagado: number
  cambio: number
  nombreCliente: string
  documento: string
}

export const ventasService = {
  async getAll(): Promise<Sale[]> {
    const response = await api.get('/ventas')
    return response.data
  },

  async getById(id: number): Promise<Sale> {
    const response = await api.get(`/ventas/${id}`)
    return response.data
  },

  async getDetalles(id: number): Promise<SaleDetail[]> {
    const response = await api.get(`/ventas/${id}/detalles`)
    return response.data
  },

  async create(data: CreateSaleDto): Promise<Sale> {
    const response = await api.post('/ventas', data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/ventas/${id}`)
  },

  async softDelete(id: number): Promise<void> {
    await api.delete(`/ventas/eliminar/${id}`)
  },
}
