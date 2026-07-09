<script setup>
import { useProductFilter } from '../composables/useProductFilter'
import { formatearFechaParaMostrar } from '../helpers/dateFormatter'
import { 
  imprimirReporte as generarReporte, 
  imprimirReporteFiltrado as generarReporteFiltrado 
} from '../helpers/reportGenerator'

const props = defineProps({
  userRole: { type: String, required: true },
  products: { type: Array, required: true },
  editingId: { type: [String, Number], default: null }
})

const emit = defineEmits(['edit', 'delete'])

const { busqueda, filtroEstado, equiposFiltrados } = useProductFilter(props)

function manejarEdicion(equipo) {
  emit('edit', equipo)
}

function manejarEliminacion(id) {
  emit('delete', id)
}

function imprimirReporte(equipo) {
  generarReporte(equipo)
}

function imprimirReporteFiltrado() {
  generarReporteFiltrado(filtroEstado.value, props.products)
}
</script>

<template>
  <section>
    <div class="bg-shark-900/70 border border-shark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 class="text-lg font-bold text-white border-l-4 border-aqua-500 pl-3 flex items-center gap-2">
          <span class="icon-[ri--list-settings-line] w-5 h-5 text-aqua-500"></span>
          Lista de Equipos 
          <span class="ml-2 p-2 rounded-2xl bg-aqua-500/50 border-2 border-aqua-500 text-shark-800"> {{ equiposFiltrados.length  }}</span>
        </h3>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div class="flex bg-shark-950/60 rounded-lg p-1 border border-shark-800 shrink-0">
            <button @click="filtroEstado = 'all'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroEstado === 'all' ? 'bg-shark-800 text-white' : 'text-shark-400 hover:text-shark-200']">Todos</button>
            <button @click="filtroEstado = 'active'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroEstado === 'active' ? 'bg-aqua-500/20 text-aqua-400' : 'text-shark-400 hover:text-shark-200']">Optimos</button>
            <button @click="filtroEstado = 'inactive'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroEstado === 'inactive' ? 'bg-rose-500/20 text-rose-400' : 'text-shark-400 hover:text-shark-200']">Reparados</button>
          </div>
          <div class="relative w-full sm:max-w-xs">
            <span class="icon-[bi--search] w-4 h-4 text-shark-400 absolute left-3.5 top-3"></span>
            <input
              type="text"
              v-model="busqueda"
              class="w-full bg-shark-950/60 border border-shark-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 transition-all duration-200"
            />
          </div>
          <button 
            @click="imprimirReporteFiltrado" 
            class="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-shark-950 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 justify-center shrink-0"
          >
            <span class="icon-[ri--printer-line] w-4.5 h-4.5"></span>
            <span>Imprimir Reporte</span>
          </button>
        </div>
      </div>

      <!-- Vista de Escritorio (Tabla) -->
      <div class="hidden md:block overflow-x-auto rounded-xl border border-shark-800/80">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">ID</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Nombre</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Marca</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Encargado</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Estado</th>
              <th v-if="filtroEstado !== 'inactive'" class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Revisión</th>
              <th class="bg-shark-950/40 text-shark-400 px-5 py-4 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="equiposFiltrados.length === 0">
              <td :colspan="filtroEstado !== 'inactive' ? 7 : 6" class="text-center text-shark-400 py-10 px-5 border-b border-shark-800/60">
                No se encontraron equipos
              </td>
            </tr>
            <tr
              v-for="equipo in equiposFiltrados"
              :key="equipo.id"
              :class="['border-b border-shark-800/60 hover:bg-shark-950/20 transition-all duration-150', { 'bg-aqua-500/5': editingId === equipo.id }]"
            >
              <td class="px-5 py-4 text-sm font-semibold text-aqua-500 w-[80px]">{{ equipo.id }}</td>
              <td class="px-5 py-4 text-sm">
                <div class="font-bold text-white">{{ equipo.name }}</div>
                <div v-if="equipo.idEquipo" class="text-xs text-aqua-500 font-semibold mt-0.5">ID Equipo: {{ equipo.idEquipo }}</div>
                <div v-if="equipo.description" class="text-xs text-shark-400 mt-1 max-w-[280px]">{{ equipo.description }}</div>
              </td>
              <td class="px-5 py-4 text-sm text-shark-200">{{ equipo.marca }}</td>
              <td class="px-5 py-4 text-sm text-shark-200">
                <div>{{ equipo.encargado || '-' }}</div>
                <div v-if="equipo.departamento" class="text-xs text-shark-400 mt-1">{{ equipo.departamento }}</div>
              </td>
              <td class="px-5 py-4 text-sm">
                <span :class="['inline-block text-xs font-semibold px-2.5 py-1 rounded-md border', 
                  (equipo.nuevo === true || equipo.nuevo === 'true') ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/20' :
                  (equipo.danado === true || equipo.danado === 'true') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  (equipo.status === true || equipo.statusStr === 'Reparado') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                ]">
                  {{ equipo.statusStr || ((equipo.nuevo === true || equipo.nuevo === 'true') ? 'Óptimo' : ((equipo.danado === true || equipo.danado === 'true') ? 'Dañado' : (equipo.status ? 'Reparado' : 'Por reparar'))) }}
                </span>
              </td>
              <td v-if="filtroEstado !== 'inactive'" class="px-5 py-4 text-sm text-shark-200">{{ formatearFechaParaMostrar(equipo.fechaRevision) }}</td>
              <td class="px-5 py-4 text-sm text-right w-[200px]">
                <div class="flex gap-2 justify-end">
                  <button @click="imprimirReporte(equipo)" class="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-shark-950 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1">
                    <span class="icon-[ri--printer-line] w-4.5 h-4.5"></span>
                    PDF
                  </button>
                  <button v-if="userRole !== 'user'" @click="manejarEdicion(equipo)" class="bg-aqua-500/10 border border-aqua-500/30 text-aqua-400 hover:bg-aqua-500 hover:text-shark-950 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1">
                    <span class="icon-[bx--edit] w-4.5 h-4.5"></span>
                    Editar
                  </button>
                  <button
                    v-if="userRole === 'admin'"
                    @click="manejarEliminacion(equipo.id)"
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
 
      <!-- Vista de Móvil (Tarjetas) -->
      <div class="md:hidden flex flex-col gap-4">
        <div
          v-for="equipo in equiposFiltrados"
          :key="equipo.id"
          :class="['bg-shark-950/40 border border-shark-800 rounded-xl p-4 flex flex-col gap-4 transition-all duration-150', { 'bg-aqua-500/5 border-aqua-500/30': editingId === equipo.id }]"
        >
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-aqua-500">ID: {{ equipo.id }}</span>
            <span :class="['inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-widest', 
              (equipo.nuevo === true || equipo.nuevo === 'true') ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/20' :
              (equipo.danado === true || equipo.danado === 'true') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
              (equipo.status === true || equipo.statusStr === 'Reparado') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              'bg-amber-500/10 text-amber-400 border-amber-500/20'
            ]">
              {{ (equipo.statusStr || ((equipo.nuevo === true || equipo.nuevo === 'true') ? 'Óptimo' : ((equipo.danado === true || equipo.danado === 'true') ? 'Dañado' : (equipo.status ? 'Reparado' : 'Por reparar')))).toUpperCase() }}
            </span>
          </div>

          <div class="flex flex-col gap-2">
            <div>
              <h4 class="font-bold text-white text-base">{{ equipo.name }}</h4>
              <p v-if="equipo.idEquipo" class="text-xs text-aqua-500 font-semibold mt-0.5">ID Equipo: {{ equipo.idEquipo }}</p>
              <p v-if="equipo.description" class="text-xs text-shark-400 mt-1">{{ equipo.description }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-shark-800/60 text-xs">
              <div>
                <span class="text-shark-400 block mb-0.5">Marca</span>
                <span class="text-white font-semibold">{{ equipo.marca }}</span>
              </div>
              <div>
                <span class="text-shark-400 block mb-0.5">Encargado</span>
                <span class="text-white font-semibold">{{ equipo.encargado || '-' }}</span>
              </div>
              <div v-if="equipo.departamento" class="col-span-2">
                <span class="text-shark-400 block mb-0.5">Departamento</span>
                <span class="text-white font-semibold">{{ equipo.departamento }}</span>
              </div>
              <div v-if="equipo.fechaRevision" class="col-span-2">
                <span class="text-shark-400 block mb-0.5">Fecha de Revisión</span>
                <span class="text-white font-semibold">{{ formatearFechaParaMostrar(equipo.fechaRevision) }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-3 border-t border-shark-800/60 justify-end flex-wrap">
            <button @click="imprimirReporte(equipo)" class="flex-1 min-w-[80px] justify-center bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-shark-950 text-xs font-bold px-3 py-2 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1.5">
              <span class="icon-[ri--printer-line] w-4.5 h-4.5"></span>
              PDF
            </button>
            <button v-if="userRole !== 'user'" @click="manejarEdicion(equipo)" class="flex-1 min-w-[80px] justify-center bg-aqua-500/10 border border-aqua-500/30 text-aqua-400 hover:bg-aqua-500 hover:text-shark-950 text-xs font-bold px-3 py-2 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1.5">
              <span class="icon-[bx--edit] w-4.5 h-4.5"></span>
              Editar
            </button>
            <button
              v-if="userRole === 'admin'"
              @click="manejarEliminacion(equipo.id)"
              class="flex-1 min-w-[80px] justify-center bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold px-3 py-2 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1.5"
            >
              <span class="icon-[bi--trash] w-4.5 h-4.5"></span>
              Eliminar
            </button>
          </div>
        </div>

        <div v-if="equiposFiltrados.length === 0" class="text-center text-shark-400 py-8 bg-shark-950/20 border border-shark-800 rounded-xl">
          No se encontraron equipos
        </div>
      </div>
    </div>
  </section>
</template>
