export function formatearFechaParaInput(cadenaFecha) {
  if (!cadenaFecha) return ''
  const fecha = new Date(cadenaFecha)
  if (isNaN(fecha.getTime())) return ''
  return fecha.toISOString().split('T')[0]
}

export function formatearFechaParaMostrar(cadenaFecha) {
  if (!cadenaFecha) return '-'
  const fecha = new Date(cadenaFecha)
  if (isNaN(fecha.getTime())) return cadenaFecha
  return fecha.toLocaleDateString('es-ES')
}
