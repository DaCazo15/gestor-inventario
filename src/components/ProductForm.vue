<script setup>
import { useProductForm } from '../composables/useProductForm'

const props = defineProps({
  userRole: { type: String, required: true },
  editingProduct: { type: Object, default: null },
  existingProducts: { type: Array, default: () => [] }
})

const emit = defineEmits(['save', 'cancel'])

const {
  isEditing,
  name,
  marca,
  description,
  encargado,
  notificante,
  status,
  statusStr,
  fechaIngreso,
  fechaEgreso,
  handleStatusChange,
  handleSubmit,
  cancelEdit
} = useProductForm(props, emit)
</script>

<template>
  <section>
    <div class="bg-shark-900/70 border border-shark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
      <h3 class="text-lg font-bold text-white mb-6 border-l-4 border-aqua-500 pl-3 flex items-center gap-2">
        <span :class="['w-5 h-5 text-aqua-500', isEditing ? 'icon-[ri--keyboard-line]' : 'icon-[ri--add-circle-line]']"></span>
        {{ isEditing ? 'Editar Equipo' : 'Agregar Equipo' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="flex flex-col gap-2">
            <label for="name" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Nombre </label>
            <input
              type="text"
              id="name"
              v-model="name"
              required
              placeholder="Ej: Servidor Web HP"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="marca" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Marca </label>
            <input
              type="text"
              id="marca"
              v-model="marca"
              required
              placeholder="Ej: Hewlett-Packard"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="encargado" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Encargado</label>
            <input
              type="text"
              id="encargado"
              v-model="encargado"
              placeholder="Nombre del encargado"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="notificante" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Notificante</label>
            <input
              type="text"
              id="notificante"
              v-model="notificante"
              placeholder="Nombre de quien notifica"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="fechaIngreso" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Fecha Ingreso</label>
            <input
              type="date"
              id="fechaIngreso"
              v-model="fechaIngreso"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="fechaEgreso" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Fecha Egreso</label>
            <input
              type="date"
              id="fechaEgreso"
              v-model="fechaEgreso"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <label for="description" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Descripción</label>
            <input
              type="text"
              id="description"
              v-model="description"
              placeholder="Detalles sobre el estado o ubicación del equipo"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex items-center gap-3 pt-4 md:pt-6">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="status"
                @change="handleStatusChange"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-shark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-shark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aqua-500"></div>
            </label>
            <span class="text-sm font-semibold text-white">Estado: {{ statusStr }}</span>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button type="submit" class="bg-aqua-500 hover:bg-aqua-600 active:bg-aqua-700 text-shark-950 font-bold px-6 py-2.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-aqua-500/10 hover:shadow-aqua-500/20">
            <span class="icon-[ri--save-3-fill] w-5 h-5"></span>
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="cancelEdit"
            class="bg-shark-950/40 border border-shark-800 hover:bg-shark-800 text-white px-6 py-2.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1"
          >
            <span class="icon-[bx--x] w-5 h-5"></span>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
