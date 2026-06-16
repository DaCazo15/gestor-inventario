<script setup>
import { computed, onMounted } from 'vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import { useAuth } from './composables/useAuth'
import { useProducts } from './composables/useProducts'

const { usuarioActual, cargandoAuth, inicializarAuth, manejarLogin, manejarLogout } = useAuth()
const { equipos, cargandoEquipos, obtenerEquipos, agregarEquipo, actualizarEquipo, eliminarEquipo } = useProducts()

const estaCargando = computed(() => cargandoAuth.value || cargandoEquipos.value)

onMounted(() => {
  if (inicializarAuth()) {
    obtenerEquipos()
  }
})

async function alIniciarSesion(credenciales) {
  if (await manejarLogin(credenciales)) {
    await obtenerEquipos()
  }
}
</script>

<template>
  <div class="flex justify-center items-start min-h-screen w-full relative">
    <div v-if="estaCargando" class="fixed inset-0 bg-shark-950/70 backdrop-blur-sm z-9999 flex justify-center items-center">
      <div class="w-12 h-12 border-4 border-aqua-500/20 border-t-aqua-500 rounded-full animate-spin shadow-lg shadow-aqua-500/10"></div>
    </div>
    
    <Login
      v-if="!usuarioActual"
      @login="alIniciarSesion"
    />
    <Dashboard
      v-else
      :user="usuarioActual"
      :products="equipos"
      @logout="manejarLogout"
      @add-product="agregarEquipo"
      @update-product="actualizarEquipo"
      @delete-product="eliminarEquipo"
    />
  </div>
</template>
