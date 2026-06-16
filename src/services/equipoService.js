import { api } from './api'

export const equipoService = {
  getEquipos: () => api.get('/equipo'),
  createEquipo: (data) => api.post('/equipo', data),
  updateEquipo: (id, data) => api.put(`/equipo/${id}`, data),
  deleteEquipo: (id) => api.delete(`/equipo/${id}`)
}
