<script setup>
import { ref, computed } from 'vue'
import { formatearFechaParaMostrar } from '../helpers/dateFormatter'
import { imprimirReporteServicios } from '../helpers/reportGenerator'

const props = defineProps({
  products: { type: Array, required: true },
  userRole: { type: String, required: true }
})

const emit = defineEmits(['volver', 'edit'])

const filtroServicio = ref('todos')
const busqueda = ref('')


const criterios = {
  reparar: (p) => {
    const isNuevo = p.nuevo === true || p.nuevo === 'true';
    const isDanado = p.danado === true || p.danado === 'true' || p.statusStr === 'Dañado';
    return !isNuevo && !isDanado && (p.status === false || p.statusStr === 'Por reparar');
  },
  danados: (p) => p.danado === true || p.danado === 'true' || p.statusStr === 'Dañado',
  optimos: (p) => {
    const isDanado = p.danado === true || p.danado === 'true' || p.statusStr === 'Dañado';
    return !isDanado && (p.status === true || ['Reparado', 'Óptimo'].includes(p.statusStr));
  }
};

const equiposFiltrados = computed(() => {
  // Exclude Óptimos (Nuevo) from the entire Services view
  let lista = props.products.filter(p => p.nuevo !== true && p.nuevo !== 'true');

  const filtroFn = criterios[filtroServicio.value];
  if (filtroFn) {
    lista = lista.filter(filtroFn);
  }

  const consulta = busqueda.value.toLowerCase().trim();
  if (!consulta) return lista;

  return lista.filter(p => [
    p.name, p.marca, p.encargado, p.departamento, p.idEquipo
  ].some(campo => campo?.toLowerCase().includes(consulta)));
});

const departamentosConEquipos = computed(() => {
  const agrupados = {}
  equiposFiltrados.value.forEach(equipo => {
    const depto = equipo.departamento || 'Sin Departamento'
    if (!agrupados[depto]) agrupados[depto] = []
    agrupados[depto].push(equipo)
  })
  return agrupados
})

const departamentosOrdenados = computed(() => {
  return Object.keys(departamentosConEquipos.value).sort()
})

const contadorPorReparar = computed(() => {
  return props.products.filter(p => {
    const isNuevo = p.nuevo === true || p.nuevo === 'true'
    const isDanado = p.danado === true || p.danado === 'true' || p.statusStr === 'Dañado'
    return !isNuevo && !isDanado && (p.status === false || p.statusStr === 'Por reparar')
  }).length
})

const contadorDanados = computed(() => {
  return props.products.filter(p => p.danado === true || p.danado === 'true' || p.statusStr === 'Dañado').length
})

function generarPDF() {
  imprimirReporteServicios(filtroServicio.value, props.products)
}

function iniciarEdicion(equipo) {
  emit('edit', equipo)
}
</script>

<template>
  <section>
    <div class="bg-shark-900/70 border border-shark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 class="text-lg font-bold text-white border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <span class="icon-[ri--tools-line] w-5 h-5 text-amber-500"></span>
          Registro de Servicios
          <span class="ml-2 p-2 rounded-2xl bg-amber-500/50 border-2 border-amber-500 text-shark-800">{{ equiposFiltrados.length }}</span>
        </h3>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div class="flex bg-shark-950/60 rounded-lg p-1 border border-shark-800 shrink-0">
            <button @click="filtroServicio = 'todos'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroServicio === 'todos' ? 'bg-shark-800 text-white' : 'text-shark-400 hover:text-shark-200']">Todos</button>
            <button @click="filtroServicio = 'reparar'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroServicio === 'reparar' ? 'bg-amber-500/20 text-amber-400' : 'text-shark-400 hover:text-shark-200']">Por Reparar</button>
            <button @click="filtroServicio = 'danados'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroServicio === 'danados' ? 'bg-rose-500/20 text-rose-400' : 'text-shark-400 hover:text-shark-200']">Dañados</button>
          </div>
          <div class="relative w-full sm:max-w-xs">
            <span class="icon-[bi--search] w-4 h-4 text-shark-400 absolute left-3.5 top-3"></span>
            <input
              type="text"
              v-model="busqueda"
              placeholder="Buscar equipo..."
              class="w-full bg-shark-950/60 border border-shark-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
            />
          </div>
          <button
            @click="generarPDF"
            class="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-shark-950 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 justify-center shrink-0"
          >
            <span class="icon-[ri--printer-line] w-4.5 h-4.5"></span>
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <!-- <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        <div class="bg-shark-950/40 border border-shark-800 rounded-xl p-4 text-center">
          <p class="text-2xl font-extrabold text-white">{{ equiposFiltrados.length }}</p>
          <p class="text-[11px] font-semibold text-shark-400 uppercase tracking-wider mt-1">Total Equipos</p>
        </div>
        <div class="bg-shark-950/40 border border-shark-800 rounded-xl p-4 text-center">
          <p class="text-2xl font-extrabold text-amber-400">{{ contadorPorReparar }}</p>
          <p class="text-[11px] font-semibold text-shark-400 uppercase tracking-wider mt-1">Por Reparar</p>
        </div>
        <div class="bg-shark-950/40 border border-shark-800 rounded-xl p-4 text-center">
          <p class="text-2xl font-extrabold text-rose-400">{{ contadorDanados }}</p>
          <p class="text-[11px] font-semibold text-shark-400 uppercase tracking-wider mt-1">Dañados</p>
        </div>
      </div> -->

      <div v-if="departamentosOrdenados.length === 0" class="text-center text-shark-400 py-16 bg-shark-950/20 border border-shark-800 rounded-xl">
        <span class="icon-[ri--inbox-line] w-10 h-10 mx-auto block mb-3 text-shark-600"></span>
        <p class="text-sm font-semibold">No se encontraron equipos</p>
        <p class="text-xs mt-1 text-shark-500">Intenta con otro filtro o término de búsqueda</p>
      </div>

      <div v-for="depto in departamentosOrdenados" :key="depto" class="mb-6 last:mb-0">
        <div class="flex items-center gap-3 mb-3">
          <span class="icon-[ri--building-2-line] w-4.5 h-4.5 text-amber-500"></span>
          <h4 class="text-sm font-bold text-white uppercase tracking-wider">{{ depto }}</h4>
          <span class="text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
            {{ departamentosConEquipos[depto].length }}
          </span>
        </div>

        <div class="hidden md:block overflow-x-auto rounded-xl border border-shark-800/80 mb-2">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr>
                <th class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">ID Equipo</th>
                <th class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Nombre</th>
                <th class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Marca</th>
                <th class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Encargado</th>
                <th class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Notificante</th>
                <th class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Estado</th>
                <th class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80">Revisión</th>
                <th v-if="userRole !== 'user'" class="bg-shark-950/40 text-shark-400 px-4 py-3 font-semibold text-xs uppercase tracking-wider border-b border-shark-800/80 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="equipo in departamentosConEquipos[depto]"
                :key="equipo.id"
                class="border-b border-shark-800/60 hover:bg-shark-950/20 transition-all duration-150"
              >
                <td 
                  class="px-4 py-3 text-sm font-semibold text-amber-500"
                  :class="{ 'text-amber-500/50' : equipo.danado === true }"
                >{{ equipo.idEquipo || 'S/N' }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="font-bold text-white">{{ equipo.name }}</div>
                  <div 
                    v-if="equipo.description" 
                    class="text-xs text-shark-400 mt-1 max-w-[250px]"
                  >{{ equipo.description }}</div>
                </td>
                <td 
                  class="px-4 py-3 text-sm text-shark-200"
                  :class="{ 'text-shark-600' : equipo.danado === true }"
                >{{ equipo.marca }}</td>
                <td 
                  class="px-4 py-3 text-sm text-shark-200"
                  :class="{ 'text-shark-600' : equipo.danado === true }"
                >{{ equipo.encargado || '-' }}</td>
                <td 
                  class="px-4 py-3 text-sm text-shark-200"
                  :class="{ 'text-shark-600' : equipo.danado === true }"
                >{{ equipo.notificante || '-' }}</td>
                <td class="px-4 py-3 text-sm">
                  <span :class="['inline-block text-xs font-semibold px-2.5 py-1 rounded-md border',
                    (equipo.nuevo === true || equipo.nuevo === 'true') ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/20' :
                    (equipo.danado === true || equipo.danado === 'true') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    (equipo.status === true || equipo.statusStr === 'Reparado') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  ]">
                    {{ equipo.statusStr || ((equipo.nuevo === true || equipo.nuevo === 'true') ? 'Óptimo' : ((equipo.danado === true || equipo.danado === 'true') ? 'Dañado' : (equipo.status ? 'Reparado' : 'Por reparar'))) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-shark-200">{{ equipo.fechaRevision ? formatearFechaParaMostrar(equipo.fechaRevision) : equipo.danado === true ? '' : 'Pendiente' }}</td>
                <td v-if="userRole !== 'user'" class="px-2 py-3 text-sm text-right w-[100px]">
                  <button 
                    v-if="!equipo.nuevo && !equipo.danado && (equipo.status === false || equipo.statusStr === 'Por reparar')"
                    @click="iniciarEdicion(equipo)"
                    class="bg-aqua-500/10 border border-aqua-500/30 text-aqua-400 hover:bg-aqua-500 hover:text-shark-950 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1 ml-auto"
                  >
                    <span class="icon-[bx--edit] w-4.5 h-4.5"></span>
                    Editar
                  </button>
                  <span v-else></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden flex flex-col gap-3">
          <div
            v-for="equipo in departamentosConEquipos[depto]"
            :key="equipo.id"
            class="bg-shark-950/40 border border-shark-800 rounded-xl p-4 flex flex-col gap-3"
          >
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-amber-500">{{ equipo.idEquipo || 'S/N' }}</span>
              <span :class="['inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-widest',
                (equipo.nuevo === true || equipo.nuevo === 'true') ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/20' :
                (equipo.danado === true || equipo.danado === 'true') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                (equipo.status === true || equipo.statusStr === 'Reparado') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-amber-500/10 text-amber-400 border-amber-500/20'
              ]">
                {{ (equipo.statusStr || ((equipo.nuevo === true || equipo.nuevo === 'true') ? 'Óptimo' : ((equipo.danado === true || equipo.danado === 'true') ? 'Dañado' : (equipo.status ? 'Reparado' : 'Por reparar')))).toUpperCase() }}
              </span>
            </div>
            <div>
              <h5 class="font-bold text-white text-base">{{ equipo.name }}</h5>
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
              <div>
                <span class="text-shark-400 block mb-0.5">Notificante</span>
                <span class="text-white font-semibold">{{ equipo.notificante || '-' }}</span>
              </div>
              <div>
                <span class="text-shark-400 block mb-0.5">Revisión</span>
                <span class="text-white font-semibold">{{ equipo.fechaRevision ? formatearFechaParaMostrar(equipo.fechaRevision) : (equipo.danado === true ? '' : 'Pendiente') }}</span>
              </div>
            </div>

            <!-- Botón de editar para móviles si es Por Reparar -->
            <div v-if="userRole !== 'user' && !equipo.nuevo && !equipo.danado && (equipo.status === false || equipo.statusStr === 'Por reparar')" class="flex justify-end pt-3 border-t border-shark-800/60">
              <button 
                @click="iniciarEdicion(equipo)"
                class="bg-aqua-500/10 border border-aqua-500/30 text-aqua-400 hover:bg-aqua-500 hover:text-shark-950 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1"
              >
                <span class="icon-[bx--edit] w-4 h-4"></span>
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
