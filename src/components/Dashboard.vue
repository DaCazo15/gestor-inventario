<script setup>
import { ref } from 'vue'
import ProductForm from './ProductForm.vue'
import ProductList from './ProductList.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  products: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['logout', 'add-product', 'update-product', 'delete-product'])

const equipoEnEdicion = ref(null)

function manejarGuardado(datosEnvio, estaEditando, id) {
  if (estaEditando) {
    emit('update-product', {
      id,
      ...datosEnvio
    })
  } else {
    emit('add-product', datosEnvio)
  }
  equipoEnEdicion.value = null
}

function manejarEdicion(equipo) {
  equipoEnEdicion.value = equipo
}

function manejarEliminacion(id) {
  if (confirm('¿Está seguro de que desea eliminar este equipo?')) {
    emit('delete-product', id)
    if (equipoEnEdicion.value?.id === id) {
      equipoEnEdicion.value = null
    }
  }
}
</script>

<template>
  <div class="w-full max-w-[1200px] mx-auto p-4 flex flex-col gap-8">
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-0 bg-shark-900/70 border border-shark-800/80 backdrop-blur-xl px-4 sm:px-6 py-5 rounded-2xl shadow-2xl">
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div class="w-12 h-12 rounded-full bg-linear-to-br from-aqua-500 to-aqua-700 flex justify-center items-center font-bold text-xl text-shark-950 shadow-lg shadow-aqua-500/10">
          {{ user.name.charAt(0) }}
        </div>
        <div class="flex flex-col">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span class="icon-[ri--computer-line] w-5 h-5 text-aqua-500"></span>
            Gestor de Equipos
          </h2>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-xs text-shark-400">{{ user.name }}</span>
            <span :class="['role-badge text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-widest', 
              user.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 
              user.role === 'empleado' ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/30' : 
              'bg-shark-800 text-shark-400 border-shark-700'
            ]">
              {{ user.role.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
      <button @click="$emit('logout')" class="w-full sm:w-auto justify-center bg-shark-950/40 border border-shark-800 hover:bg-rose-500/15 hover:border-rose-500 hover:text-rose-200 text-shark-200 px-4.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5">
        <span class="icon-[ri--logout-box-r-line] w-4.5 h-4.5"></span>
        Cerrar Sesión
      </button>
    </header>

    <div class="flex flex-col gap-8">
      <ProductForm 
        v-if="user.role !== 'user'"
        :user-role="user.role"
        :editing-product="equipoEnEdicion"
        :existing-products="products"
        @save="manejarGuardado"
        @cancel="equipoEnEdicion = null"
      />

      <ProductList 
        :user-role="user.role"
        :products="products"
        :editing-id="equipoEnEdicion?.id"
        @edit="manejarEdicion"
        @delete="manejarEliminacion"
      />
    </div>
  </div>
</template>
