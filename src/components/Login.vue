<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const error = ref('')

const credentials = [
  { email: 'admin@test.com', pass: 'admin123', label: 'Admin', role: 'admin', icon: 'icon-[ri--admin-fill] text-rose-500' },
  { email: 'emp@test.com', pass: 'emp123', label: 'Empleado', role: 'empleado', icon: 'icon-[ri--user-settings-fill] text-aqua-500' },
  { email: 'user@test.com', pass: 'user123', label: 'Usuario', role: 'user', icon: 'icon-[ri--user-fill] text-shark-400' }
]

function fillCredentials(email, pass) {
  username.value = email
  password.value = pass
  error.value = ''
}

function handleSubmit() {
  if (!username.value || !password.value) {
    error.value = 'Por favor complete todos los campos.'
    return
  }
  emit('login', {
    email: username.value.trim(),
    password: password.value
  })
}
</script>

<template>
  <div class="flex justify-between items-center min-h-screen w-full gap-10">
    <div class="bg-shark-900/70 border border-shark-800/80 backdrop-blur-xl rounded-2xl p-8 w-full transition-all duration-300">
      <div class="text-center mb-8 flex flex-col items-center">
        <img src="../assets/ico/ico.png" alt="tools" class="w-12 h-12 mb-3">
        <h2 class="text-2xl font-bold text-white mb-1">Iniciar Sesión</h2>
        <p class="text-sm text-shark-400">Acceda al panel de gestión de equipos</p>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <label for="username" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Usuario / Email</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="admin@test.com"
            class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-3 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 transition-all duration-200"
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="password" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="••••••••"
            class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-3 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 transition-all duration-200"
          />
        </div>

        <div v-if="error" class="bg-rose-500/10 border border-rose-500 text-rose-200 text-sm p-3 rounded-lg text-center">
          {{ error }}
        </div>

        <button type="submit" class="bg-aqua-500 hover:bg-aqua-600 active:bg-aqua-700 text-shark-950 font-bold py-3.5 rounded-lg transition-all duration-200 shadow-lg shadow-aqua-500/10 hover:shadow-aqua-500/20 flex justify-center items-center gap-2 cursor-pointer">
          <span class="icon-[ri--login-box-line] w-5 h-5"></span>
          Ingresar
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-shark-800/80">
        <h3 class="text-sm font-semibold text-white mb-1">Credenciales de prueba</h3>
        <p class="text-xs text-shark-400 mb-4">Haga clic en una cuenta para rellenar automáticamente:</p>
        <div class="flex flex-col gap-2">
          <button
            v-for="cred in credentials"
            :key="cred.email"
            type="button"
            class="
              bg-shark-950/40 border border-shark-800 hover:bg-shark-800/50 hover:border-shark-700 
              rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all duration-200
            "
            @click="fillCredentials(cred.email, cred.pass)"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white">{{ cred.label }}</span>
            </div>
            <span class="text-xs text-shark-400">{{ cred.email }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="w-[850px] h-[850px] flex items-center justify-center">
      <img 
        src="../assets/img/tecnico.avif" 
        alt="tecnico"
        class="
          rounded-xl shadow-lg shadow-aqua-500/10
          mask-[linear-gradient(to_bottom,black_50%,transparent_100%)]
        "
      >
    </div>
  </div>
</template>
