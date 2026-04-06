import api from './api'
import type { User } from '../types'

export const usuariosService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/usuarios')
    return response.data
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  },

  async create(
    data: Omit<User, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ): Promise<User> {
    const response = await api.post('/usuarios', data)
    return response.data
  },

  async update(id: number, data: Partial<User>): Promise<User> {
    const response = await api.patch(`/usuarios/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`)
  },
}
