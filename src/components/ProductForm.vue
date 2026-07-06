<script setup>
import { useProductForm } from '../composables/useProductForm'
import {departamentos} from '../helpers/listDepartamento'

const props = defineProps({
  userRole: { type: String, required: true },
  editingProduct: { type: Object, default: null },
  existingProducts: { type: Array, default: () => [] }
})

const emit = defineEmits(['save', 'cancel'])

const {
  estaEditando,
  nombre,
  marca,
  descripcion,
  encargado,
  notificante,
  estado,
  estadoTexto,
  fechaRevision,
  departamento,
  manejarCambioEstado,
  manejarEnvio,
  cancelarEdicion
} = useProductForm(props, emit)
</script>

<template>
  <section>
    <div class="bg-shark-900/70 border border-shark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
      <h3 class="text-lg font-bold text-white mb-6 border-l-4 border-aqua-500 pl-3 flex items-center gap-2">
        <span :class="['w-5 h-5 text-aqua-500', estaEditando ? 'icon-[ri--keyboard-line]' : 'icon-[ri--add-circle-line]']"></span>
        {{ estaEditando ? 'Editar Equipo' : 'Agregar Equipo' }}
      </h3>
      
      <form @submit.prevent="manejarEnvio" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex flex-col gap-2">
            <label for="nombre" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Nombre </label>
            <input
              type="text"
              id="nombre"
              v-model="nombre"
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
            <label for="fechaRevision" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Fecha de Revisión</label>
            <input
              type="date"
              id="fechaRevision"
              v-model="fechaRevision"
              :disabled="!estado"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div class="flex flex-col gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <label for="departamento" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Departamento</label>
            <select
              id="departamento"
              v-model="departamento"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200 block w-full"
            >
              <option value="" disabled selected>Seleccione un departamento</option>
              <option 
                v-for="(depto, index) in departamentos" 
                :key="index" 
                :value="depto"
              >
                {{ depto }}
              </option>
            </select>
          </div>

          <div class="flex flex-col gap-2 sm:col-span-2">
            <label for="descripcion" class="text-xs font-semibold text-shark-400 uppercase tracking-wider">Descripción</label>
            <input
              type="text"
              id="descripcion"
              v-model="descripcion"
              placeholder="Detalles sobre el estado o ubicación del equipo"
              class="bg-shark-950/60 border border-shark-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 text-sm transition-all duration-200"
            />
          </div>

          <div class="flex items-center gap-3 pt-4 sm:pt-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="estado"
                @change="manejarCambioEstado"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-shark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-shark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aqua-500"></div>
            </label>
            <span class="text-sm font-semibold text-white">Estado: {{ estadoTexto }}</span>
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row gap-3 justify-end w-full">
          <button
            v-if="estaEditando"
            type="button"
            @click="cancelarEdicion"
            class="w-full sm:w-auto justify-center bg-shark-950/40 border border-shark-800 hover:bg-shark-800 text-white px-6 py-2.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1"
          >
            <span class="icon-[bx--x] w-5 h-5"></span>
            Cancelar
          </button>
          <button type="submit" class="w-full sm:w-auto justify-center bg-aqua-500 hover:bg-aqua-600 active:bg-aqua-700 text-shark-950 font-bold px-6 py-2.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-aqua-500/10 hover:shadow-aqua-500/20">
            <span class="icon-[ri--save-3-fill] w-5 h-5"></span>
            {{ estaEditando ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
