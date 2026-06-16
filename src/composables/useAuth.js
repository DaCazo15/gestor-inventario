import { ref } from 'vue'
import { userService } from '../services/userService'

const FALLBACK_USERS = [
  { email: 'admin@test.com', pass: 'admin123', role: 'admin', name: 'Administrador' },
  { email: 'emp@test.com', pass: 'emp123', role: 'empleado', name: 'Empleado de Turno' },
  { email: 'user@test.com', pass: 'user123', role: 'user', name: 'Cliente Invitado' }
]

export function useAuth() {
  const currentUser = ref(null)
  const isAuthLoading = ref(false)

  function initializeAuth() {
    const savedUser = sessionStorage.getItem('currentUser')
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser)
    }
    return !!savedUser
  }

  async function handleLogin({ email, password }) {
    isAuthLoading.value = true
    try {
      let apiUsers = []
      try {
        apiUsers = await userService.getUsers()
      } catch (apiErr) {
        console.warn('Could not fetch users from API, using fallback list', apiErr)
      }

      const matchedApiUser = apiUsers.find(u => 
        (u.email === email || u.user === email) && u.password === password
      )

      let success = false
      if (matchedApiUser) {
        const sessionUser = {
          name: matchedApiUser.fullName || matchedApiUser.user || 'Usuario API',
          role: matchedApiUser.rol || 'user',
          email: matchedApiUser.email
        }
        currentUser.value = sessionUser
        sessionStorage.setItem('currentUser', JSON.stringify(sessionUser))
        success = true
      } else {
        const matchedFallbackUser = FALLBACK_USERS.find(u => u.email === email && u.pass === password)
        if (matchedFallbackUser) {
          currentUser.value = matchedFallbackUser
          sessionStorage.setItem('currentUser', JSON.stringify(matchedFallbackUser))
          success = true
        } else {
          alert('Credenciales incorrectas. Intente nuevamente.')
        }
      }
      return success
    } catch (err) {
      console.error('Login error:', err)
      alert('Error durante el inicio de sesión. Por favor, intente nuevamente.')
      return false
    } finally {
      isAuthLoading.value = false
    }
  }

  function handleLogout() {
    currentUser.value = null
    sessionStorage.removeItem('currentUser')
  }

  return {
    currentUser,
    isAuthLoading,
    initializeAuth,
    handleLogin,
    handleLogout
  }
}
