import { api } from './api'

export const servicioUsuario = {
  obtenerUsuarios: () => api.obtener('/user')
}
