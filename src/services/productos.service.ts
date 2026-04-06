import api from './api'
import type { Product } from '../types'

export const productosService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/productos')
    return response.data
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get(`/productos/${id}`)
    return response.data
  },

  async getByCategoria(categoriaId: number): Promise<Product[]> {
    const response = await api.get(`/productos/categoria/${categoriaId}`)
    return response.data
  },

  async getStock(): Promise<Product[]> {
    const response = await api.get('/productos/stock')
    return response.data
  },

  async create(
    data:
      | FormData
      | Omit<Product, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ): Promise<Product> {
    const response = await api.post('/productos', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return response.data
  },

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/productos/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/productos/${id}`)
  },
}
