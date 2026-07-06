import { ref, computed } from 'vue'

export function useProductFilter(props) {
  const busqueda = ref('')
  const filtroEstado = ref('active')

  const equiposFiltrados = computed(() => {
    let lista = props.products
    if (filtroEstado.value === 'active') {
      lista = lista.filter(p => p.status === true)
    } else if (filtroEstado.value === 'inactive') {
      lista = lista.filter(p => p.status === false)
    }

    const consulta = busqueda.value.toLowerCase().trim()
    if (!consulta) return lista
    return lista.filter(p =>
      p.name?.toLowerCase().includes(consulta) ||
      p.marca?.toLowerCase().includes(consulta) ||
      p.departamento?.toLowerCase().includes(consulta)
    )
  })

  return {
    busqueda,
    filtroEstado,
    equiposFiltrados
  }
}
