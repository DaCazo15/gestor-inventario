import { ref, computed, watch } from 'vue'
import { formatearFechaParaInput } from '../helpers/dateFormatter'

export function useProductForm(props, emit) {
  const estaEditando = computed(() => !!props.editingProduct)

  const nombre = ref('')
  const marca = ref('')
  const descripcion = ref('')
  const encargado = ref('')
  const notificante = ref('')
  const estado = ref(false)
  const estadoTexto = ref('Por revisar')
  const fechaRevision = ref('')
  const departamento = ref('')

  watch(() => props.editingProduct, (nuevoValor) => {
    if (nuevoValor) {
      nombre.value = nuevoValor.name || ''
      marca.value = nuevoValor.marca || ''
      descripcion.value = nuevoValor.description || ''
      encargado.value = nuevoValor.encargado || ''
      notificante.value = nuevoValor.notificante || ''
      estado.value = nuevoValor.status !== undefined ? nuevoValor.status : false
      if (nuevoValor.statusStr) {
        if (nuevoValor.statusStr === 'Activo') {
          estadoTexto.value = 'Egresado'
        } else if (nuevoValor.statusStr === 'Inactivo') {
          estadoTexto.value = 'Por revisar'
        } else {
          estadoTexto.value = nuevoValor.statusStr
        }
      } else {
        estadoTexto.value = estado.value ? 'Egresado' : 'Por revisar'
      }
      fechaRevision.value = formatearFechaParaInput(nuevoValor.fechaRevision)
      departamento.value = nuevoValor.departamento || ''
    } else {
      reiniciarFormulario()
    }
  }, { immediate: true })

  watch(estado, (nuevoEstado) => {
    if (!nuevoEstado) {
      fechaRevision.value = ''
    } else if (!fechaRevision.value) {
      fechaRevision.value = new Date().toISOString().split('T')[0]
    }
  })

  function manejarCambioEstado() {
    estadoTexto.value = estado.value ? 'Egresado' : 'Por revisar'
  }

  function reiniciarFormulario() {
    nombre.value = ''
    marca.value = ''
    descripcion.value = ''
    encargado.value = ''
    notificante.value = ''
    estado.value = false
    estadoTexto.value = 'Por revisar'
    fechaRevision.value = ''
    departamento.value = ''
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
      fechaRevision: fechaRevision.value ? new Date(fechaRevision.value).toISOString() : null,
      departamento: departamento.value
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
    fechaRevision,
    departamento,
    manejarCambioEstado,
    manejarEnvio,
    cancelarEdicion
  }
}
