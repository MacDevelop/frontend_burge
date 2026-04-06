import api from './api'
import type { Category } from '../types'

export const categoriasService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get('/categorias')
    return response.data
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get(`/categorias/${id}`)
    return response.data
  },

  async create(
    data: Omit<Category, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ): Promise<Category> {
    const response = await api.post('/categorias', data)
    return response.data
  },

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const response = await api.patch(`/categorias/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`)
  },
}
