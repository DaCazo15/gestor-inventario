import { ref, computed } from 'vue'

export function useProductFilter(props) {
  const busqueda = ref('')
  const filtroEstado = ref('active')

  const equiposFiltrados = computed(() => {
    let lista = props.products.filter(p => {
      const isNuevo = p.nuevo === true || p.nuevo === 'true'
      const isDanado = p.danado === true || p.danado === 'true' || p.statusStr === 'Dañado'
      const isReparado = !isNuevo && !isDanado && (p.status === true || p.statusStr === 'Reparado')
      return isNuevo || isReparado
    })

    if (filtroEstado.value === 'active') {
      lista = lista.filter(p => p.nuevo === true || p.nuevo === 'true')
    } else if (filtroEstado.value === 'inactive') {
      lista = lista.filter(p => {
        const isNuevo = p.nuevo === true || p.nuevo === 'true'
        const isDanado = p.danado === true || p.danado === 'true' || p.statusStr === 'Dañado'
        return !isNuevo && !isDanado && (p.status === true || p.statusStr === 'Reparado')
      })
    }

    const consulta = busqueda.value.toLowerCase().trim()
    if (!consulta) return lista
    return lista.filter(p =>
      p.name?.toLowerCase().includes(consulta) ||
      p.marca?.toLowerCase().includes(consulta) ||
      p.departamento?.toLowerCase().includes(consulta) ||
      p.idEquipo?.toLowerCase().includes(consulta)
    )
  })

  return {
    busqueda,
    filtroEstado,
    equiposFiltrados
  }
}
