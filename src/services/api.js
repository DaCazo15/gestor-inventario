const URL_BASE = 'https://6a3180fe7bc5e1c61265d91d.mockapi.io'

async function peticion(endpoint, opciones = {}) {
  const url = `${URL_BASE}${endpoint}`
  const cabeceras = {
    'Content-Type': 'application/json',
    ...opciones.headers
  }

  const respuesta = await fetch(url, { ...opciones, headers: cabeceras })

  if (!respuesta.ok) {
    const textoError = await respuesta.text()
    throw new Error(`Error HTTP! estado: ${respuesta.status}, mensaje: ${textoError}`)
  }

  return respuesta.json()
}

export const api = {
  obtener: (endpoint) => peticion(endpoint, { method: 'GET' }),
  crear: (endpoint, cuerpo) => peticion(endpoint, { method: 'POST', body: JSON.stringify(cuerpo) }),
  actualizar: (endpoint, cuerpo) => peticion(endpoint, { method: 'PUT', body: JSON.stringify(cuerpo) }),
  eliminar: (endpoint) => peticion(endpoint, { method: 'DELETE' })
}
