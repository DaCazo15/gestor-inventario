<script setup>
import { computed, onMounted } from 'vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import { useAuth } from './composables/useAuth'
import { useProducts } from './composables/useProducts'

const { currentUser, isAuthLoading, initializeAuth, handleLogin, handleLogout } = useAuth()
const { products, isProductsLoading, fetchEquipos, addProduct, updateProduct, deleteProduct } = useProducts()

const isLoading = computed(() => isAuthLoading.value || isProductsLoading.value)

onMounted(() => {
  if (initializeAuth()) {
    fetchEquipos()
  }
})

async function onLogin(credentials) {
  if (await handleLogin(credentials)) {
    await fetchEquipos()
  }
}
</script>

<template>
  <div class="flex justify-center items-start min-h-screen w-full relative">
    <div v-if="isLoading" class="fixed inset-0 bg-shark-950/70 backdrop-blur-sm z-9999 flex justify-center items-center">
      <div class="w-12 h-12 border-4 border-aqua-500/20 border-t-aqua-500 rounded-full animate-spin shadow-lg shadow-aqua-500/10"></div>
    </div>
    
    <Login
      v-if="!currentUser"
      @login="onLogin"
    />
    <Dashboard
      v-else
      :user="currentUser"
      :products="products"
      @logout="handleLogout"
      @add-product="addProduct"
      @update-product="updateProduct"
      @delete-product="deleteProduct"
    />
  </div>
</template>
