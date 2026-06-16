import { ref, computed } from 'vue'

export function useProductFilter(props) {
  const searchQuery = ref('')
  const filterStatus = ref('active') // 'all', 'active', 'inactive'

  const filteredProducts = computed(() => {
    let list = props.products
    if (filterStatus.value === 'active') {
      list = list.filter(p => p.status === true)
    } else if (filterStatus.value === 'inactive') {
      list = list.filter(p => p.status === false)
    }

    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return list
    return list.filter(p => 
      p.name?.toLowerCase().includes(query) || 
      p.marca?.toLowerCase().includes(query)
    )
  })

  return {
    searchQuery,
    filterStatus,
    filteredProducts
  }
}
