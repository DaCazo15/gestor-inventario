<script setup>
import { useProductFilter } from '../composables/useProductFilter'
import { formatDateForDisplay } from '../helpers/dateFormatter'

const props = defineProps({
  userRole: { type: String, required: true },
  products: { type: Array, required: true },
  editingId: { type: [String, Number], default: null }
})

const emit = defineEmits(['edit', 'delete'])

const { searchQuery, filterStatus, filteredProducts } = useProductFilter(props)

function handleEdit(product) {
  emit('edit', product)
}

function handleDelete(id) {
  emit('delete', id)
}
</script>

<template>
  <section>
    <div class="bg-shark-900/70 border border-shark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 class="text-lg font-bold text-white border-l-4 border-aqua-500 pl-3 flex items-center gap-2">
          <span class="icon-[ri--list-settings-line] w-5 h-5 text-aqua-500"></span>
          Lista de Equipos
        </h3>
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="flex bg-shark-950/60 rounded-lg p-1 border border-shark-800">
            <button @click="filterStatus = 'all'" :class="['px-3 py-1.5 text-xs font-bold rounded-md transition-all', filterStatus === 'all' ? 'bg-shark-800 text-white' : 'text-shark-400 hover:text-shark-200']">Todos</button>
            <button @click="filterStatus = 'active'" :class="['px-3 py-1.5 text-xs font-bold rounded-md transition-all', filterStatus === 'active' ? 'bg-aqua-500/20 text-aqua-400' : 'text-shark-400 hover:text-shark-200']">Activos</button>
            <button @click="filterStatus = 'inactive'" :class="['px-3 py-1.5 text-xs font-bold rounded-md transition-all', filterStatus === 'inactive' ? 'bg-rose-500/20 text-rose-400' : 'text-shark-400 hover:text-shark-200']">Inactivos</button>
          </div>
          <div class="relative w-full max-w-xs">
            <span class="icon-[bi--search] w-4 h-4 text-shark-400 absolute left-3.5 top-3"></span>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar por nombre o marca..."
              class="w-full bg-shark-950/60 border border-shark-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-shark-800/80">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">ID</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Nombre</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Marca</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Encargado</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Estado</th>
              <th v-if="filterStatus === 'inactive'" class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Ingreso</th>
              <th v-if="userRole !== 'user'" class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td :colspan="userRole !== 'user' ? 7 : 6" class="text-center text-shark-400 py-10 px-5 border-b border-shark-800/60">
                No se encontraron equipos
              </td>
            </tr>
            <tr
              v-for="prod in filteredProducts"
              :key="prod.id"
              :class="['border-b border-shark-800/60 hover:bg-shark-950/20 transition-all duration-150', { 'bg-aqua-500/5': editingId === prod.id }]"
            >
              <td class="px-5 py-4 text-sm font-semibold text-aqua-500 w-[80px]">{{ prod.id }}</td>
              <td class="px-5 py-4 text-sm">
                <div class="font-bold text-white">{{ prod.name }}</div>
                <div v-if="prod.description" class="text-xs text-shark-400 mt-1 max-w-[280px] truncate">{{ prod.description }}</div>
              </td>
              <td class="px-5 py-4 text-sm text-shark-200">{{ prod.marca }}</td>
              <td class="px-5 py-4 text-sm text-shark-200">{{ prod.encargado || '-' }}</td>
              <td class="px-5 py-4 text-sm">
                <span :class="['inline-block text-xs font-semibold px-2.5 py-1 rounded-md border', 
                  prod.status ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                ]">
                  {{ prod.statusStr || (prod.status ? 'Activo' : 'Inactivo') }}
                </span>
              </td>
              <td v-if="filterStatus === 'inactive'" class="px-5 py-4 text-sm text-shark-200">{{formatDateForDisplay(prod.fechaIngreso)}}</td>
              <td v-if="userRole !== 'user'" class="px-5 py-4 text-sm text-right w-[180px]">
                <div class="flex gap-2 justify-end">
                  <button @click="handleEdit(prod)" class="bg-aqua-500/10 border border-aqua-500/30 text-aqua-400 hover:bg-aqua-500 hover:text-shark-950 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1">
                    <span class="icon-[bx--edit] w-4.5 h-4.5"></span>
                    Editar
                  </button>
                  <button
                    v-if="userRole === 'admin'"
                    @click="handleDelete(prod.id)"
                    class="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1"
                  >
                    <span class="icon-[bi--trash] w-4.5 h-4.5"></span>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
