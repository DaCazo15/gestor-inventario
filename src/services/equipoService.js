import { api } from './api'

export const servicioEquipo = {
  obtenerEquipos: () => api.obtener('/equipo'),
  crearEquipo: (datos) => api.crear('/equipo', datos),
  actualizarEquipo: (id, datos) => api.actualizar(`/equipo/${id}`, datos),
  eliminarEquipo: (id) => api.eliminar(`/equipo/${id}`)
}
