import { ref } from 'vue'
import { servicioUsuario } from '../services/userService'

const USUARIOS_FALLBACK = [
  { email: 'admin@test.com', pass: 'admin123', role: 'admin', name: 'Administrador' },
  { email: 'emp@test.com', pass: 'emp123', role: 'empleado', name: 'Empleado de Turno' },
  { email: 'user@test.com', pass: 'user123', role: 'user', name: 'Cliente Invitado' }
]

export function useAuth() {
  const usuarioActual = ref(null)
  const cargandoAuth = ref(false)

  function inicializarAuth() {
    const usuarioGuardado = sessionStorage.getItem('usuarioActual')
    if (usuarioGuardado) {
      usuarioActual.value = JSON.parse(usuarioGuardado)
    }
    return !!usuarioGuardado
  }

  async function manejarLogin({ email, password }) {
    cargandoAuth.value = true
    try {
      let usuariosApi = []
      try {
        usuariosApi = await servicioUsuario.obtenerUsuarios()
      } catch (errorApi) {
        console.warn('No se pudo obtener usuarios de la API, usando lista de respaldo', errorApi)
      }

      const usuarioEncontradoApi = usuariosApi.find(u =>
        (u.email === email || u.user === email) && u.password === password
      )

      let exitoso = false
      if (usuarioEncontradoApi) {
        const sesionUsuario = {
          name: usuarioEncontradoApi.fullName || usuarioEncontradoApi.user || 'Usuario API',
          role: usuarioEncontradoApi.rol || 'user',
          email: usuarioEncontradoApi.email
        }
        usuarioActual.value = sesionUsuario
        sessionStorage.setItem('usuarioActual', JSON.stringify(sesionUsuario))
        exitoso = true
      } else {
        const usuarioFallback = USUARIOS_FALLBACK.find(u => u.email === email && u.pass === password)
        if (usuarioFallback) {
          usuarioActual.value = usuarioFallback
          sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioFallback))
          exitoso = true
        } else {
          alert('Credenciales incorrectas. Intente nuevamente.')
        }
      }
      return exitoso
    } catch (error) {
      console.error('Error en el inicio de sesión:', error)
      alert('Error durante el inicio de sesión. Por favor, intente nuevamente.')
      return false
    } finally {
      cargandoAuth.value = false
    }
  }

  function manejarLogout() {
    usuarioActual.value = null
    sessionStorage.removeItem('usuarioActual')
  }

  return {
    usuarioActual,
    cargandoAuth,
    inicializarAuth,
    manejarLogin,
    manejarLogout
  }
}
