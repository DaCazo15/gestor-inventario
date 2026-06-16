import { ref } from 'vue'
import { equipoService } from '../services/equipoService'

export function useProducts() {
  const products = ref([])
  const isProductsLoading = ref(false)

  async function fetchEquipos() {
    isProductsLoading.value = true
    try {
      const data = await equipoService.getEquipos()
      products.value = data
    } catch (err) {
      console.error('Error fetching equipos:', err)
    } finally {
      isProductsLoading.value = false
    }
  }

  async function addProduct(submitData) {
    isProductsLoading.value = true
    try {
      await equipoService.createEquipo(submitData)
      await fetchEquipos()
    } catch (err) {
      console.error('Error adding equipo:', err)
      alert('No se pudo agregar el equipo.')
    } finally {
      isProductsLoading.value = false
    }
  }

  async function updateProduct(submitData) {
    isProductsLoading.value = true
    try {
      const { id, ...data } = submitData
      await equipoService.updateEquipo(id, data)
      await fetchEquipos()
    } catch (err) {
      console.error('Error updating equipo:', err)
      alert('No se pudo actualizar el equipo.')
    } finally {
      isProductsLoading.value = false
    }
  }

  async function deleteProduct(id) {
    isProductsLoading.value = true
    try {
      await equipoService.deleteEquipo(id)
      await fetchEquipos()
    } catch (err) {
      console.error('Error deleting equipo:', err)
      alert('No se pudo eliminar el equipo.')
    } finally {
      isProductsLoading.value = false
    }
  }

  return {
    products,
    isProductsLoading,
    fetchEquipos,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
