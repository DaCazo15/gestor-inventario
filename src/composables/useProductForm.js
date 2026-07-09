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
  const estadoTexto = ref('Por reparar')
  const nuevo = ref(false)
  const danado = ref(false)
  const fechaRevision = ref('')
  const departamento = ref('')
  const idEquipo = ref('')
  const fechaRegistro = ref('')

  watch(() => props.editingProduct, (nuevoValor) => {
    if (nuevoValor) {
      nombre.value = nuevoValor.name || ''
      marca.value = nuevoValor.marca || ''
      descripcion.value = nuevoValor.description || ''
      encargado.value = nuevoValor.encargado || ''
      notificante.value = nuevoValor.notificante || ''
      
      nuevo.value = nuevoValor.nuevo === true || nuevoValor.nuevo === 'true'
      danado.value = nuevoValor.danado === true || nuevoValor.danado === 'true'
      estado.value = nuevoValor.status !== undefined ? nuevoValor.status : false
      
      if (nuevo.value) {
        estadoTexto.value = 'Óptimo'
      } else if (danado.value) {
        estadoTexto.value = 'Dañado'
      } else {
        estadoTexto.value = estado.value ? 'Reparado' : 'Por reparar'
      }
      
      fechaRevision.value = formatearFechaParaInput(nuevoValor.fechaRevision)
      departamento.value = nuevoValor.departamento || ''
      idEquipo.value = nuevoValor.idEquipo || ''
      fechaRegistro.value = nuevoValor.fechaRegistro || ''
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
    if (estado.value) {
      danado.value = false
      nuevo.value = false
      estadoTexto.value = 'Reparado'
    } else {
      estadoTexto.value = 'Por reparar'
    }
  }

  function manejarCambioNuevo() {
    if (nuevo.value) {
      danado.value = false
      estado.value = true
      estadoTexto.value = 'Óptimo'
    } else {
      estadoTexto.value = estado.value ? 'Reparado' : 'Por reparar'
    }
  }

  function manejarCambioDanado() {
    if (danado.value) {
      nuevo.value = false
      estado.value = false
      estadoTexto.value = 'Dañado'
    } else {
      estadoTexto.value = estado.value ? 'Reparado' : 'Por reparar'
    }
  }

  function reiniciarFormulario() {
    nombre.value = ''
    marca.value = ''
    descripcion.value = ''
    encargado.value = ''
    notificante.value = ''
    nuevo.value = false
    danado.value = false
    estado.value = false
    estadoTexto.value = 'Por reparar'
    fechaRevision.value = ''
    departamento.value = ''
    idEquipo.value = ''
    fechaRegistro.value = ''
  }

  function manejarEnvio() {
    const datosEnvio = {
      name: nombre.value.trim(),
      marca: marca.value.trim(),
      description: descripcion.value.trim(),
      encargado: encargado.value.trim(),
      notificante: notificante.value.trim(),
      status: estado.value,
      statusStr: nuevo.value ? 'Óptimo' : (danado.value ? 'Dañado' : (estado.value ? 'Reparado' : 'Por reparar')),
      nuevo: nuevo.value,
      danado: danado.value,
      fechaRevision: fechaRevision.value ? new Date(fechaRevision.value).toISOString() : null,
      departamento: departamento.value,
      idEquipo: idEquipo.value.trim(),
      fechaRegistro: fechaRegistro.value || new Date().toISOString()
    }

    if (!datosEnvio.name || !datosEnvio.marca || !datosEnvio.idEquipo) {
      alert('Por favor complete los campos obligatorios (Nombre, Marca e ID Equipo).')
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
    nuevo,
    danado,
    fechaRevision,
    departamento,
    idEquipo,
    fechaRegistro,
    manejarCambioEstado,
    manejarCambioNuevo,
    manejarCambioDanado,
    manejarEnvio,
    cancelarEdicion
  }
}
