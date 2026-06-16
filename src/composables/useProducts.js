import { ref } from 'vue'
import { servicioEquipo } from '../services/equipoService'

export function useProducts() {
  const equipos = ref([])
  const cargandoEquipos = ref(false)

  async function obtenerEquipos() {
    cargandoEquipos.value = true
    try {
      const datos = await servicioEquipo.obtenerEquipos()
      equipos.value = datos
    } catch (error) {
      console.error('Error al obtener equipos:', error)
    } finally {
      cargandoEquipos.value = false
    }
  }

  async function agregarEquipo(datosEnvio) {
    cargandoEquipos.value = true
    try {
      await servicioEquipo.crearEquipo(datosEnvio)
      await obtenerEquipos()
    } catch (error) {
      console.error('Error al agregar equipo:', error)
      alert('No se pudo agregar el equipo.')
    } finally {
      cargandoEquipos.value = false
    }
  }

  async function actualizarEquipo(datosEnvio) {
    cargandoEquipos.value = true
    try {
      const { id, ...datos } = datosEnvio
      await servicioEquipo.actualizarEquipo(id, datos)
      await obtenerEquipos()
    } catch (error) {
      console.error('Error al actualizar equipo:', error)
      alert('No se pudo actualizar el equipo.')
    } finally {
      cargandoEquipos.value = false
    }
  }

  async function eliminarEquipo(id) {
    cargandoEquipos.value = true
    try {
      await servicioEquipo.eliminarEquipo(id)
      await obtenerEquipos()
    } catch (error) {
      console.error('Error al eliminar equipo:', error)
      alert('No se pudo eliminar el equipo.')
    } finally {
      cargandoEquipos.value = false
    }
  }

  return {
    equipos,
    cargandoEquipos,
    obtenerEquipos,
    agregarEquipo,
    actualizarEquipo,
    eliminarEquipo
  }
}
