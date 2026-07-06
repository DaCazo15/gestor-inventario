<script setup>
import { useProductFilter } from '../composables/useProductFilter'
import { formatearFechaParaMostrar } from '../helpers/dateFormatter'

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
  const ventanaImpresion = window.open('', '_blank')
  const fechaActual = new Date().toLocaleDateString('es-ES')
  const fechaRevisionFormateada = equipo.fechaRevision ? formatearFechaParaMostrar(equipo.fechaRevision) : 'Pendiente'

  ventanaImpresion.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Técnico - ${equipo.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          background: #ffffff;
          padding: 40px;
          margin: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-area h1 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .logo-area p {
          font-size: 12px;
          color: #64748b;
          margin: 4px 0 0 0;
        }
        .info-area {
          text-align: right;
        }
        .info-area p {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0;
        }
        .report-title-box {
          text-align: center;
          margin-bottom: 40px;
        }
        .report-title-box h2 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }
        .grid-details {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }
        .detail-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }
        .detail-card h3 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin: 0 0 6px 0;
          letter-spacing: 0.5px;
        }
        .detail-card p {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }
        .full-width {
          grid-column: span 2;
        }
        .status-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .status-egresado {
          background: #d1fae5;
          color: #065f46;
        }
        .status-pendiente {
          background: #fef3c7;
          color: #92400e;
        }
        .signature-area {
          margin-top: 100px;
          display: flex;
          justify-content: space-around;
        }
        .signature-box {
          text-align: center;
          width: 200px;
          border-top: 1px solid #94a3b8;
          padding-top: 10px;
          font-size: 13px;
          color: #475569;
        }
        @media print {
          body {
            padding: 20px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-area">
          <h1>GESTOR DE INVENTARIO</h1>
          <p>Reporte de Control de Activos e Infraestructura</p>
        </div>
        <div class="info-area">
          <p><strong>ID de Reporte:</strong> #REP-${equipo.id}</p>
          <p><strong>Fecha Generación:</strong> ${fechaActual}</p>
        </div>
      </div>

      <div class="report-title-box">
        <h2>Ficha Técnica del Equipo</h2>
      </div>

      <div class="grid-details">
        <div class="detail-card">
          <h3>Nombre del Equipo</h3>
          <p>${equipo.name}</p>
        </div>
        <div class="detail-card">
          <h3>Marca</h3>
          <p>${equipo.marca}</p>
        </div>
        <div class="detail-card">
          <h3>Departamento</h3>
          <p>${equipo.departamento || 'No especificado'}</p>
        </div>
        <div class="detail-card">
          <h3>Estado del Equipo</h3>
          <p>
            <span class="status-badge ${equipo.status ? 'status-egresado' : 'status-pendiente'}">
              ${equipo.statusStr || (equipo.status ? 'Egresado' : 'Por revisar')}
            </span>
          </p>
        </div>
        <div class="detail-card">
          <h3>Encargado</h3>
          <p>${equipo.encargado || 'No asignado'}</p>
        </div>
        <div class="detail-card">
          <h3>Notificante</h3>
          <p>${equipo.notificante || 'No asignado'}</p>
        </div>
        <div class="detail-card full-width">
          <h3>Fecha de Revisión</h3>
          <p>${fechaRevisionFormateada}</p>
        </div>
        <div class="detail-card full-width">
          <h3>Descripción y Notas Técnicas</h3>
          <p style="font-weight: 400; line-height: 1.6; color: #334155;">
            ${equipo.description || 'Sin descripción adicional registrada.'}
          </p>
        </div>
      </div>

      <div class="signature-area">
        <div class="signature-box">
          Firma del Encargado
        </div>
        <div class="signature-box">
          Firma Técnico Autorizado
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      <\/script>
    </body>
    </html>
  `)
  ventanaImpresion.document.close()
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
            <button @click="filtroEstado = 'active'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroEstado === 'active' ? 'bg-aqua-500/20 text-aqua-400' : 'text-shark-400 hover:text-shark-200']">Egresados</button>
            <button @click="filtroEstado = 'inactive'" :class="['flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', filtroEstado === 'inactive' ? 'bg-rose-500/20 text-rose-400' : 'text-shark-400 hover:text-shark-200']">Por revisar</button>
          </div>
          <div class="relative w-full sm:max-w-xs">
            <span class="icon-[bi--search] w-4 h-4 text-shark-400 absolute left-3.5 top-3"></span>
            <input
              type="text"
              v-model="busqueda"
              placeholder="Buscar por nombre o marca..."
              class="w-full bg-shark-950/60 border border-shark-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-500/20 transition-all duration-200"
            />
          </div>
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
                <div v-if="equipo.description" class="text-xs text-shark-400 mt-1 max-w-[280px] truncate">{{ equipo.description }}</div>
              </td>
              <td class="px-5 py-4 text-sm text-shark-200">{{ equipo.marca }}</td>
              <td class="px-5 py-4 text-sm text-shark-200">
                <div>{{ equipo.encargado || '-' }}</div>
                <div v-if="equipo.departamento" class="text-xs text-shark-400 mt-1">{{ equipo.departamento }}</div>
              </td>
              <td class="px-5 py-4 text-sm">
                <span :class="['inline-block text-xs font-semibold px-2.5 py-1 rounded-md border', 
                  equipo.status ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                ]">
                  {{ equipo.statusStr || (equipo.status ? 'Activo' : 'Inactivo') }}
                </span>
              </td>
              <td v-if="filtroEstado !== 'inactive'" class="px-5 py-4 text-sm text-shark-200">{{ formatearFechaParaMostrar(equipo.fechaRevision) }}</td>
              <td class="px-5 py-4 text-sm text-right w-[200px]">
                <div class="flex gap-2 justify-end">
                  <button v-if="equipo.status" @click="imprimirReporte(equipo)" class="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-shark-950 text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1">
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
              equipo.status ? 'bg-aqua-500/10 text-aqua-400 border-aqua-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            ]">
              {{ equipo.statusStr || (equipo.status ? 'ACTIVO' : 'INACTIVO') }}
            </span>
          </div>

          <div class="flex flex-col gap-2">
            <div>
              <h4 class="font-bold text-white text-base">{{ equipo.name }}</h4>
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
            <button v-if="equipo.status" @click="imprimirReporte(equipo)" class="flex-1 min-w-[80px] justify-center bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-shark-950 text-xs font-bold px-3 py-2 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-1.5">
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
