import api from './api'
import type { Employee } from '../types'

export const empleadosService = {
  async getAll(): Promise<Employee[]> {
    const response = await api.get('/empleados')
    return response.data
  },

  async getById(id: number): Promise<Employee> {
    const response = await api.get(`/empleados/${id}`)
    return response.data
  },

  async create(
    data: Omit<Employee, 'id' | 'fechaCreacion' | 'fechaModificacion' | 'fechaEliminacion'>,
  ): Promise<Employee> {
    const response = await api.post('/empleados', data)
    return response.data
  },

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const response = await api.patch(`/empleados/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/empleados/${id}`)
  },
}
