import { ref, computed, watch } from 'vue'
import { formatearFechaParaInput } from '../helpers/dateFormatter'

export function useProductForm(props, emit) {
  const estaEditando = computed(() => !!props.editingProduct)

  const nombre = ref('')
  const marca = ref('')
  const descripcion = ref('')
  const encargado = ref('')
  const notificante = ref('')
  const estado = ref(true)
  const estadoTexto = ref('Activo')
  const fechaIngreso = ref('')
  const fechaEgreso = ref('')

  watch(() => props.editingProduct, (nuevoValor) => {
    if (nuevoValor) {
      nombre.value = nuevoValor.name || ''
      marca.value = nuevoValor.marca || ''
      descripcion.value = nuevoValor.description || ''
      encargado.value = nuevoValor.encargado || ''
      notificante.value = nuevoValor.notificante || ''
      estado.value = nuevoValor.status !== undefined ? nuevoValor.status : true
      estadoTexto.value = nuevoValor.statusStr || (estado.value ? 'Activo' : 'Inactivo')
      fechaIngreso.value = formatearFechaParaInput(nuevoValor.fechaIngreso)
      fechaEgreso.value = formatearFechaParaInput(nuevoValor.fechaEgreso)
    } else {
      reiniciarFormulario()
    }
  }, { immediate: true })

  watch(fechaEgreso, (nuevoValor) => {
    if (nuevoValor) {
      estado.value = false
      estadoTexto.value = 'Inactivo'
    } else {
      estado.value = true
      estadoTexto.value = 'Activo'
    }
  })

  function manejarCambioEstado() {
    estadoTexto.value = estado.value ? 'Activo' : 'Inactivo'
    if (!estado.value && !fechaEgreso.value) {
      fechaEgreso.value = new Date().toISOString().split('T')[0]
    } else if (estado.value && fechaEgreso.value) {
      fechaEgreso.value = ''
    }
  }

  function reiniciarFormulario() {
    nombre.value = ''
    marca.value = ''
    descripcion.value = ''
    encargado.value = ''
    notificante.value = ''
    estado.value = true
    estadoTexto.value = 'Activo'
    fechaIngreso.value = ''
    fechaEgreso.value = ''
  }

  function manejarEnvio() {
    const datosEnvio = {
      name: nombre.value.trim(),
      marca: marca.value.trim(),
      description: descripcion.value.trim(),
      encargado: encargado.value.trim(),
      notificante: notificante.value.trim(),
      status: estado.value,
      statusStr: estadoTexto.value,
      fechaIngreso: fechaIngreso.value ? new Date(fechaIngreso.value).toISOString() : null,
      fechaEgreso: fechaEgreso.value ? new Date(fechaEgreso.value).toISOString() : null
    }

    if (!datosEnvio.name || !datosEnvio.marca) {
      alert('Por favor complete los campos obligatorios (Nombre y Marca).')
      return
    }

    if (!estaEditando.value && props.userRole === 'empleado' && props.existingProducts.some(p => p.name?.toLowerCase() === datosEnvio.name.toLowerCase())) {
      alert('Como empleado no está autorizado a duplicar o crear nuevos productos sin un ID único nuevo.')
      return
    }

    emit('save', datosEnvio, estaEditando.value, props.editingProduct?.id)
  }

  function cancelarEdicion() {
    reiniciarFormulario()
    emit('cancel')
  }

  return {
    estaEditando,
    nombre,
    marca,
    descripcion,
    encargado,
    notificante,
    estado,
    estadoTexto,
    fechaIngreso,
    fechaEgreso,
    manejarCambioEstado,
    manejarEnvio,
    cancelarEdicion
  }
}
