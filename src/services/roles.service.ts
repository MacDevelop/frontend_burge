import api from './api'
import type { Role } from '../types'

export const rolesService = {
  async getAll(): Promise<Role[]> {
    const response = await api.get('/roles')
    return response.data
  },

  async getById(id: number): Promise<Role> {
    const response = await api.get(`/roles/${id}`)
    return response.data
  },

  async create(
    data: Omit<Role, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ): Promise<Role> {
    const response = await api.post('/roles', data)
    return response.data
  },

  async update(id: number, data: Partial<Role>): Promise<Role> {
    const response = await api.patch(`/roles/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/roles/${id}`)
  },
}
