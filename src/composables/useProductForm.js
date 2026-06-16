import { ref, computed, watch } from 'vue'
import { formatDateForInput } from '../helpers/dateFormatter'

export function useProductForm(props, emit) {
  const isEditing = computed(() => !!props.editingProduct)
  
  const name = ref('')
  const marca = ref('')
  const description = ref('')
  const encargado = ref('')
  const notificante = ref('')
  const status = ref(true)
  const statusStr = ref('Activo')
  const fechaIngreso = ref('')
  const fechaEgreso = ref('')

  watch(() => props.editingProduct, (newVal) => {
    if (newVal) {
      name.value = newVal.name || ''
      marca.value = newVal.marca || ''
      description.value = newVal.description || ''
      encargado.value = newVal.encargado || ''
      notificante.value = newVal.notificante || ''
      status.value = newVal.status !== undefined ? newVal.status : true
      statusStr.value = newVal.statusStr || (status.value ? 'Activo' : 'Inactivo')
      fechaIngreso.value = formatDateForInput(newVal.fechaIngreso)
      fechaEgreso.value = formatDateForInput(newVal.fechaEgreso)
    } else {
      resetForm()
    }
  }, { immediate: true })

  watch(fechaEgreso, (newVal) => {
    if (newVal) {
      status.value = false
      statusStr.value = 'Inactivo'
    } else {
      status.value = true
      statusStr.value = 'Activo'
    }
  })

  function handleStatusChange() {
    statusStr.value = status.value ? 'Activo' : 'Inactivo'
    if (!status.value && !fechaEgreso.value) {
      fechaEgreso.value = new Date().toISOString().split('T')[0]
    } else if (status.value && fechaEgreso.value) {
      fechaEgreso.value = ''
    }
  }

  function resetForm() {
    name.value = ''
    marca.value = ''
    description.value = ''
    encargado.value = ''
    notificante.value = ''
    status.value = true
    statusStr.value = 'Activo'
    fechaIngreso.value = ''
    fechaEgreso.value = ''
  }

  function handleSubmit() {
    const submitData = {
      name: name.value.trim(),
      marca: marca.value.trim(),
      description: description.value.trim(),
      encargado: encargado.value.trim(),
      notificante: notificante.value.trim(),
      status: status.value,
      statusStr: statusStr.value,
      fechaIngreso: fechaIngreso.value ? new Date(fechaIngreso.value).toISOString() : null,
      fechaEgreso: fechaEgreso.value ? new Date(fechaEgreso.value).toISOString() : null
    }

    if (!submitData.name || !submitData.marca) {
      alert('Por favor complete los campos obligatorios (Nombre y Marca).')
      return
    }

    if (!isEditing.value && props.userRole === 'empleado' && props.existingProducts.some(p => p.name?.toLowerCase() === submitData.name.toLowerCase())) {
      alert('Como empleado no está autorizado a duplicar o crear nuevos productos sin un ID único nuevo.')
      return
    }

    emit('save', submitData, isEditing.value, props.editingProduct?.id)
  }

  function cancelEdit() {
    resetForm()
    emit('cancel')
  }

  return {
    isEditing,
    name,
    marca,
    description,
    encargado,
    notificante,
    status,
    statusStr,
    fechaIngreso,
    fechaEgreso,
    handleStatusChange,
    handleSubmit,
    cancelEdit
  }
}
